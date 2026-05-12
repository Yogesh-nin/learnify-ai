import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialCardItem from "./MaterialCardItem";
import MaterialCardItemSkeleton from "./MaterialCardItemSkeleton";

function StudyMaterialSection({ courseId, course }) {
  const [studyTypeContent, setStudyTypeContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read notes to prepare it",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcard to help remember concepts",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcard",
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/quiz.png",
      path: "/quiz",
      type: "quiz",
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning",
      icon: "/qa.png",
      path: "/qa",
      type: "qa",
    },
  ];

  const GetStudyMaterial = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "ALL",
      });
      setStudyTypeContent(result.data);
    } catch (err) {
      console.error("Error fetching study material:", err);
      setError("Failed to load study material.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      GetStudyMaterial();
    }
  }, [courseId]);

  if (error) {
    return <div className="text-red-500 mt-5">{error}</div>;
  }

  return (
    <div className="mt-5">
      <h2 className="font-medium text-xl">Study Material</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-3">
        {loading
          ? [1, 2, 3, 4].map((item, index) => (
              <MaterialCardItemSkeleton key={index} />
            ))
          : MaterialList.map((item, index) => (
              <MaterialCardItem
                key={index}
                item={item}
                studyTypeContent={studyTypeContent}
                course={course}
                refreshData={GetStudyMaterial}
              />
            ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
