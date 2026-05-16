"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CourseBackButton from "../_components/CourseBackButton";

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepCount, setStepCount] = useState(0);

  const prevStep = () => stepCount > 0 && setStepCount(stepCount - 1);
  const nextStep = () =>
    stepCount < notes.length - 1 && setStepCount(stepCount + 1);

  useEffect(() => {
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  const fetchNotes = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "notes",
      });
      console.log("NOTES", result.data);
      setNotes(result.data);
    } catch (err) {
      console.error("Error fetching notes:", err.message);
      setError("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <CourseBackButton className="mb-5" />
        <p className="text-center text-blue-500">Loading notes...</p>
      </>
    );
  if (error)
    return (
      <>
        <CourseBackButton className="mb-5" />
        <p className="text-center text-red-500">{error}</p>
      </>
    );

  // CHAPTER_NOTES_TABLE is empty – notes haven't been generated yet
  if (!notes || notes.length === 0) {
    return (
      <div>
        <CourseBackButton className="mb-5" />
        <div className="text-center text-gray-500 mt-20">
        <p className="text-xl font-semibold">No notes available yet.</p>
        <p className="text-sm mt-2">
          Notes are generated in the background. Make sure the Inngest dev server
          is running, then wait a moment and refresh.
        </p>
        </div>
      </div>
    );
  }

  let jsonObject = null;
  try {
    const rawNotes = notes[stepCount]?.notes;

    if (!rawNotes) {
      throw new Error("Empty notes field");
    }

    // Drizzle may already deserialise JSON columns to an object
    if (typeof rawNotes === "object") {
      jsonObject = rawNotes;
    } else {
      // Strip markdown code fences if the AI wrapped the output
      let cleaned = rawNotes.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();
      }
      jsonObject = JSON.parse(cleaned);
    }
  } catch (err) {
    console.error("Error parsing JSON:", err.message);
    return (
      <div>
        <CourseBackButton className="mb-5" />
        <div className="text-center text-red-500 mt-10 p-4">
        <p className="font-semibold">Failed to parse notes data for chapter {stepCount + 1}.</p>
        <p className="text-sm mt-1 text-gray-500">
          The stored content may not be valid JSON. Check the Inngest logs and regenerate the course.
        </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CourseBackButton className="mb-5" />
      {/* Navigation */}
      <div className="flex gap-5 items-center mb-5">
        <button
          className="btn btn-outline-primary"
          onClick={prevStep}
          disabled={stepCount === 0 || notes.length === 0}
        >
          Previous
        </button>

        <div className="flex w-full gap-2">
          {notes.map((_, index) => (
            <div
              key={index}
              className={`w-full h-2 rounded-full ${
                index <= stepCount ? "bg-primary" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={nextStep}
          disabled={stepCount === notes.length - 1 || notes.length === 0}
        >
          Next
        </button>
      </div>

      {/* Render Content */}
      {jsonObject && (
        <div>
          <div className="flex text-2xl font-bold mb-3">
            <span className="pr-3">{jsonObject.emoji}</span>
            {jsonObject.chapterTitle}
          </div>
          <p className="text-gray-700 mb-5">{jsonObject.chapterSummary}</p>

          {jsonObject.topics.map((topic, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 rounded-lg shadow-md mb-4"
            >
              <h1 className="text-lg font-bold mb-2">{topic.topicTitle}</h1>
              {/* Render Markdown Content */}
              <ReactMarkdown
                children={topic.content}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewNotes;
