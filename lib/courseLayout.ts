
type CourseLayoutDefaults = {
  topic?: string;
  difficultyLevel?: string;
};

/** Loose shapes from AI / stored JSON before normalization */
type RawTopic = {
  topicTitle?: string;
  title?: string;
  content?: string;
};

type RawChapter = {
  chapterTitle?: string;
  title?: string;
  chapterSummary?: string;
  summary?: string;
  emoji?: string;
  topics?: unknown[];
};

type RawCourseLayout = {
  courseTitle?: string;
  title?: string;
  courseSummary?: string;
  summary?: string;
  difficultyLevel?: string;
  chapters?: unknown[];
  courseLayout?: RawCourseLayout;
};

export function stripJsonFences(text: string) {
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

export function parseAiJson(textOrValue: unknown) {
  if (textOrValue == null) return null;
  if (typeof textOrValue === "object") return textOrValue;
  if (typeof textOrValue !== "string") return textOrValue;
  return JSON.parse(stripJsonFences(textOrValue));
}

function normalizeTopic(topic: unknown) {
  if (typeof topic === "string") {
    return { topicTitle: topic, content: "" };
  }
  if (topic && typeof topic === "object") {
    const t = topic as RawTopic;
    return {
      topicTitle: t.topicTitle || t.title || "",
      content: t.content || "",
    };
  }
  return { topicTitle: "", content: "" };
}

function normalizeChapter(chapter: unknown) {
  if (!chapter || typeof chapter !== "object") {
    return {
      chapterTitle: "",
      chapterSummary: "",
      emoji: "📘",
      topics: [],
    };
  }

  const c = chapter as RawChapter;
  const topics = Array.isArray(c.topics)
    ? c.topics.map(normalizeTopic)
    : [];

  return {
    chapterTitle: c.chapterTitle || c.title || "",
    chapterSummary: c.chapterSummary || c.summary || "",
    emoji: c.emoji || "📘",
    topics,
  };
}

export function normalizeCourseLayout(
  raw: unknown,
  defaults: CourseLayoutDefaults = {}
) {
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

  const course = layout as RawCourseLayout;
  const chapters = Array.isArray(course.chapters)
    ? course.chapters.map(normalizeChapter)
    : [];

  return {
    courseTitle:
      course.courseTitle ||
      course.title ||
      defaults.topic ||
      "Untitled Course",
    courseSummary: course.courseSummary || course.summary || "",
    difficultyLevel:
      course.difficultyLevel || defaults.difficultyLevel || "Medium",
    chapters,
  };
}
