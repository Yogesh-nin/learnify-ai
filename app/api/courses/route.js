import { db } from "/configs/db";
import { STUDY_MATERIAL_TABLE, CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "/configs/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { normalizeCourseLayout } from "/lib/courseLayout";
import {
  getAuthenticatedUserEmail,
  getOwnedCourse,
} from "/lib/courseAccess";

function withNormalizedLayout(course) {
  if (!course?.courseLayout) return course;
  try {
    return {
      ...course,
      courseLayout: normalizeCourseLayout(course.courseLayout, {
        topic: course.topic,
        difficultyLevel: course.difficultyLevel,
      }),
    };
  } catch {
    return course;
  }
}

export async function POST(req) {
  try {
    const email = await getAuthenticatedUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, email))
      .orderBy(desc(STUDY_MATERIAL_TABLE.id))

    return NextResponse.json({
      result: result.map(withNormalizedLayout),
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "The 'courseId' query parameter is required." },
        { status: 400 }
      );
    }

    const owned = await getOwnedCourse(courseId);
    if (owned.error) return owned.error;

    return NextResponse.json({
      result: withNormalizedLayout(owned.course),
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course. Please try again later." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "The 'courseId' query parameter is required." },
        { status: 400 }
      );
    }

    const owned = await getOwnedCourse(courseId);
    if (owned.error) return owned.error;

    // Delete child rows first (Inngest notes.generate inserts chapterNotes per chapter)
    await db.delete(CHAPTER_NOTES_TABLE).where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
    await db.delete(STUDY_TYPE_CONTENT_TABLE).where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

    const result = await db
      .delete(STUDY_MATERIAL_TABLE)
      .where(
        and(
          eq(STUDY_MATERIAL_TABLE.courseId, courseId),
          eq(STUDY_MATERIAL_TABLE.createdBy, owned.email)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Course and associated data deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course. Please try again later." },
      { status: 500 }
    );
  }
}