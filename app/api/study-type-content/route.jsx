import { STUDY_TYPE_CONTENT_TABLE } from "/configs/schema";
import { db } from "/configs/db";
import {
  GenerateStudyTypeContentAiModel,
  GenerateQuizAiModel,
  GenerateQaAiModel,
} from "/configs/AiModel";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { chapter, courseId, type } = await req.json();

    if (!chapter || !courseId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const PROMPT =
      type === "Flashcard"
        ? `Generate a ${type} on the topic: "${chapter}" in JSON format with front-back content, Maximum 15 entries.`
        : type === "Quiz"
        ? `Generate a Quiz on the topic: "${chapter}" with questions, options, and correct answers in JSON format (Maximum 10 entries).`
        : `
        Create **15 question-and-answer pairs** based on the following topics: 
        ${chapter}

        The Answer should be at least of 10 lines	

### **Output Requirements**
1. **Questions and Answers:**
   - Each question must be concise and directly address one of the topics above.
   - Each answer should be **detailed and explanatory**, providing:
     - A clear explanation of the concept.
     - Examples or scenarios illustrating the answer where applicable.
     - Practical tips or best practices.


### **Output Example for a Question**
emoji: A relevant emoji to visually represent the chapter.
content (string): Detailed content for the topic written in Md format, and ready for rendering in a React.js component.

EXAMPLE OUTPUT
{
  "questions": [
    {
      "question": "",
      "answer": ""
    }
}

**IMPORTANT**
There should be an emoji
Give me in .md format



 7. **Additional Notes:**  
   - **IMPORTANT** There should be an emoji
   - Every Content should be in detail and explained properly
   - Each 'content' field should use simple and concise language suitable for study notes.  
   - Ensure that topics include clear definitions, key points, and, where appropriate, examples or sample code.  
   - All generated content should be focused on clarity and exam preparation, with minimal redundancy.  

 8. **Avoid Common Errors:**  
   - Double-check for mismatched brackets, missing fields, or improperly formatted strings.  
        
        `;

    // Insert placeholder row into DB
    const insertResult = await db
      .insert(STUDY_TYPE_CONTENT_TABLE)
      .values({
        courseId: courseId,
        type: type,
      })
      .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });

    const recordId = insertResult[0]?.id;

    // Generate content directly using the AI model
    const aiModel =
      type === "Flashcard"
        ? GenerateStudyTypeContentAiModel
        : type === "Quiz"
        ? GenerateQuizAiModel
        : GenerateQaAiModel;

        
        const aiResponse = await aiModel.sendMessage(PROMPT);
        const aiContent = JSON.parse(aiResponse.response.text());
        
        console.log({ aiResponse })
    // Update the row with the generated content
    await db
      .update(STUDY_TYPE_CONTENT_TABLE)
      .set({
        content: aiContent,
        status: "Ready",
      })
      .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));

    return NextResponse.json({ id: recordId });
  } catch (error) {
    console.error("Error in POST /api/study-type-content:", error.message);
    return NextResponse.json(
      { error: "Failed to generate study material. Please try again." },
      { status: 500 }
    );
  }
}
