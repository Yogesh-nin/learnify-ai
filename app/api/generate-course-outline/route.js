import { inngest } from "/inngest/client";
import { generateCourseOutline } from "/configs/generateCourseOutline";
import { db } from "/configs/db";
import { STUDY_MATERIAL_TABLE } from "/configs/schema";
import { NextResponse } from "next/server";
import {
  normalizeCourseLayout,
  parseAiJson,
} from "/lib/courseLayout";
function buildCourseOutlinePrompt({ topic, courseType, difficultyLevel }) {
  return `Generate a single JSON OBJECT (NOT an array) for a complete study course.

Topic: ${topic}
Course type: ${courseType}
Difficulty level: ${difficultyLevel}

Required structure (return exactly this shape as one object):
{
  "courseTitle": "string",
  "courseSummary": "string",
  "difficultyLevel": "${difficultyLevel}",
  "chapters": [
    {
      "chapterTitle": "string",
      "chapterSummary": "string",
      "emoji": "string",
      "topics": [
        {
          "topicTitle": "string",
          "content": "string — HTML with Tailwind className attributes for React"
        }
      ]
    }
  ]
}

Rules:
- Return ONE JSON object only. Do NOT wrap the object in an array like [{ ... }].
- Include 3 to 5 chapters.
- Each chapter must have 2 to 4 topics with detailed HTML content in each topic's "content" field.
- Use className (not class) on HTML elements.
- Each chapter must include an emoji.
- difficultyLevel must be "${difficultyLevel}".
- Output valid JSON only, no markdown fences.`;
}

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } =
      await req.json();

    if (!courseId || !topic || !courseType || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const level = difficultyLevel || "Medium";

    const PROMPT = buildCourseOutlinePrompt({
      topic,
      courseType,
      difficultyLevel: level,
    });

    const aiText = await generateCourseOutline(PROMPT);
    const parsed = parseAiJson(aiText);
    const courseLayout = normalizeCourseLayout(parsed, {
      topic,
      difficultyLevel: level,
    });

    if (!courseLayout.chapters?.length) {
      return NextResponse.json(
        { error: "AI did not return any chapters. Please try again." },
        { status: 422 }
      );
    }

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId,
        courseType,
        createdBy,
        topic,
        difficultyLevel: level,
        courseLayout,
        status: "Generating",
      })
      .returning();

    const course = dbResult[0];

    await inngest.send({
      name: "notes.generate",
      data: { course },
    });

    return NextResponse.json({ result: course });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
