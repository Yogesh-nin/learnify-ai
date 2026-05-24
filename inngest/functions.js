import {
  STUDY_TYPE_CONTENT_TABLE,
  USER_TABLE,
} from "../configs/schema";
import { db } from "../configs/db";
import { inngest } from "./client";
import {
  GenerateQaAiModel,
  GenerateQuizAiModel,
  GenerateStudyTypeContentAiModel,
} from "../configs/AiModel";
import { eq } from "drizzle-orm";
import {
  generateChapterNotesForCourse,
  setCourseStatus,
} from "../lib/generateChapterNotes";

// Function to test the "hello-world" event
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

// Function to create a new user if they don't already exist
export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const user = event.data?.user ?? event.data;

    const result = await step.run(
      "Check User and Create if Not in DB",
      async () => {
        const { ensureUserInDb } = await import("../lib/ensureUser.ts");
        return ensureUserInDb(user);
      }
    );

    console.log(result);
    return "Success";
  }
);

// Function to generate notes for chapters in a course
export const GenerateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;
    const courseId = course?.courseId;

    try {
      const notesResult = await step.run("Generate Chapter Notes", async () =>
        generateChapterNotesForCourse(course)
      );
      return { notesResult };
    } catch (error) {
      console.error("Error during GenerateNotes function execution:", error);
      if (courseId) {
        await step.run("Mark course as failed", async () => {
          await setCourseStatus(courseId, "Failed");
        });
      }
      throw error;
    }
  }
);

export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content" },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, courseId, recordId } = event.data;
    const AIResult = await step.run(
      "Generating Flashcard using AI",
      async () => {
        const result =
          studyType == "Flashcard"
            ? await GenerateStudyTypeContentAiModel.sendMessage(prompt)
            : studyType == "Quiz"
            ? await GenerateQuizAiModel.sendMessage(prompt)
            : await GenerateQaAiModel.sendMessage(prompt);
        const AIResult = JSON.parse(result.response.text());
        return AIResult;
      }
    );
    const DbResult = await step.run("Save Result to DB", async () => {
      const result = await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({
          content: AIResult,
          status: "Ready",
        })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
      return "Data Inserted";
    });
  }
);
