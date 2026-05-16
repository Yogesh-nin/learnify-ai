import { db } from "../configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE } from "../configs/schema";
import { eq } from "drizzle-orm";
import { normalizeCourseLayout, stripJsonFences } from "./courseLayout";
import { generateNotesAiModel } from "../configs/AiModel";

export async function setCourseStatus(courseId, status) {
  await db
    .update(STUDY_MATERIAL_TABLE)
    .set({ status })
    .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
}

function buildChapterNotesPrompt(chapter) {
  return `Generate a JSON object that represents study notes for a course chapter. The JSON should meet the following requirements:
0. Provided Chapters:
${JSON.stringify(chapter)}

1. Structure:
The JSON must include the following fields:
chapterTitle: The title of the chapter.
chapterSummary: A brief summary of the chapter.
emoji: A relevant emoji to visually represent the chapter.
topics: A list of topics covered in the chapter. Each topic must be an object with:
topicTitle (string): The title of the topic.
content (string): Detailed content for the topic written in Md format, and ready for rendering in a React.js component.

2. Content Formatting: Give me in .md format
**IMPORTANT** There should be an emoji. Output valid JSON only, no markdown fences.`;
}

async function generateNotesForChapter(chapter, courseId, index) {
  const result = await generateNotesAiModel.sendMessage(
    buildChapterNotesPrompt(chapter)
  );
  let aiResp = await result.response.text();
  aiResp = stripJsonFences(aiResp);

  let parsedNotes;
  try {
    parsedNotes = JSON.parse(aiResp);
  } catch (parseErr) {
    console.error(
      `Chapter ${index} notes JSON parse failed, storing raw text:`,
      parseErr.message
    );
    parsedNotes = aiResp;
  }

  await db.insert(CHAPTER_NOTES_TABLE).values({
    chapterId: index,
    courseId,
    notes:
      typeof parsedNotes === "string"
        ? parsedNotes
        : JSON.stringify(parsedNotes),
  });
}

/**
 * Generates chapter notes for all chapters and sets course status to Ready or Failed.
 * Used by Inngest (production) and Next.js after() (local dev).
 */
export async function generateChapterNotesForCourse(course) {
  const courseId = course.courseId;

  if (!courseId) {
    throw new Error("courseId is required");
  }

  console.log(`[chapter-notes] Starting for course ${courseId}`);

  const layout = normalizeCourseLayout(course.courseLayout, {
    topic: course.topic,
    difficultyLevel: course.difficultyLevel,
  });

  await db
    .update(STUDY_MATERIAL_TABLE)
    .set({ courseLayout: layout })
    .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

  const chapters = layout.chapters;
  if (!chapters?.length) {
    throw new Error("No chapters found in course layout");
  }

  // Remove stale notes if this job is retried
  await db
    .delete(CHAPTER_NOTES_TABLE)
    .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

  let succeeded = 0;
  const errors = [];

  // Sequential to reduce Gemini rate-limit failures
  for (let index = 0; index < chapters.length; index++) {
    try {
      await generateNotesForChapter(chapters[index], courseId, index);
      succeeded++;
      console.log(
        `[chapter-notes] Chapter ${index + 1}/${chapters.length} done for ${courseId}`
      );
    } catch (err) {
      console.error(
        `[chapter-notes] Chapter ${index} failed for ${courseId}:`,
        err?.message || err
      );
      errors.push({ index, error: err?.message || String(err) });
    }
  }

  if (succeeded === 0) {
    await setCourseStatus(courseId, "Failed");
    throw new Error(
      `Failed to generate notes for all chapters: ${errors.map((e) => e.index).join(", ")}`
    );
  }

  await setCourseStatus(courseId, "Ready");
  console.log(
    `[chapter-notes] Finished ${courseId}: ${succeeded}/${chapters.length} chapters, status=Ready`
  );

  return { succeeded, failed: errors.length, total: chapters.length };
}
