import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "/configs/db";
import { STUDY_MATERIAL_TABLE } from "/configs/schema";

/** Signed-in user's email (matches `createdBy` on courses). */
export async function getAuthenticatedUserEmail() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  return user?.primaryEmailAddress?.emailAddress ?? null;
}

/**
 * Load a course only if the current user owns it.
 * One indexed query: WHERE courseId = ? AND createdBy = ?
 */
export async function getOwnedCourse(courseId) {
  const email = await getAuthenticatedUserEmail();
  if (!email) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!courseId) {
    return {
      error: NextResponse.json(
        { error: "The 'courseId' field is required." },
        { status: 400 }
      ),
    };
  }

  const rows = await db
    .select()
    .from(STUDY_MATERIAL_TABLE)
    .where(
      and(
        eq(STUDY_MATERIAL_TABLE.courseId, courseId),
        eq(STUDY_MATERIAL_TABLE.createdBy, email)
      )
    )
    .limit(1);

  if (rows.length === 0) {
    // 404 avoids leaking whether another user's course exists
    return {
      error: NextResponse.json({ error: "Course not found." }, { status: 404 }),
    };
  }

  return { course: rows[0], email };
}

/** Ensure the caller owns the course; returns an error response or null. */
export async function assertCourseOwner(courseId) {
  const result = await getOwnedCourse(courseId);
  if (result.error) return result.error;
  return null;
}
