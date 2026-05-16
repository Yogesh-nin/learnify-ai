/**
 * Normalizes AI-generated course layout into a consistent object shape.
 * Handles common AI mistakes: wrapping in an array, nested courseLayout key, etc.
 */

export function stripJsonFences(text) {
  if (typeof text !== "string") return text;
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return cleaned;
}

export function parseAiJson(textOrValue) {
  if (textOrValue == null) return null;
  if (typeof textOrValue === "object") return textOrValue;
  if (typeof textOrValue !== "string") return textOrValue;
  return JSON.parse(stripJsonFences(textOrValue));
}

function normalizeTopic(topic) {
  if (typeof topic === "string") {
    return { topicTitle: topic, content: "" };
  }
  if (topic && typeof topic === "object") {
    return {
      topicTitle: topic.topicTitle || topic.title || "",
      content: topic.content || "",
    };
  }
  return { topicTitle: "", content: "" };
}

function normalizeChapter(chapter) {
  if (!chapter || typeof chapter !== "object") {
    return {
      chapterTitle: "",
      chapterSummary: "",
      emoji: "📘",
      topics: [],
    };
  }

  const topics = Array.isArray(chapter.topics)
    ? chapter.topics.map(normalizeTopic)
    : [];

  return {
    chapterTitle: chapter.chapterTitle || chapter.title || "",
    chapterSummary: chapter.chapterSummary || chapter.summary || "",
    emoji: chapter.emoji || "📘",
    topics,
  };
}

export function normalizeCourseLayout(raw, defaults = {}) {
  let layout = parseAiJson(raw);

  if (Array.isArray(layout)) {
    if (layout.length === 0) {
      throw new Error("Course layout array is empty");
    }
    layout = layout[0];
  }

  if (layout?.courseLayout && typeof layout.courseLayout === "object") {
    layout = layout.courseLayout;
  }

  if (!layout || typeof layout !== "object" || Array.isArray(layout)) {
    throw new Error("Invalid course layout: expected a JSON object");
  }

  const chapters = Array.isArray(layout.chapters)
    ? layout.chapters.map(normalizeChapter)
    : [];

  return {
    courseTitle:
      layout.courseTitle ||
      layout.title ||
      defaults.topic ||
      "Untitled Course",
    courseSummary: layout.courseSummary || layout.summary || "",
    difficultyLevel:
      layout.difficultyLevel || defaults.difficultyLevel || "Medium",
    chapters,
  };
}
