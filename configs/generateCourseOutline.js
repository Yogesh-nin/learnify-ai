const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const geminiModelName =
  process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash-lite";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

/** Generates course outline JSON without chapter-notes few-shot history. */
async function generateCourseOutline(prompt) {
  const model = genAI.getGenerativeModel({
    model: geminiModelName,
    generationConfig,
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { generateCourseOutline };
