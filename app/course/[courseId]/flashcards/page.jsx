"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import FlashcardItem from "./_components/FlashcardItem";

function Flashcards() {
  const { courseId } = useParams();
  const [flashCards, setFlashCards] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetFlashCards();
  }, []);

  const GetFlashCards = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Flashcard",
      });
      setFlashCards(result.data);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (index) => {
    setFlippedStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const navigate = useCallback(
    (dir) => {
      const cards = flashCards.content || [];
      const next = currentIndex + dir;
      if (next < 0 || next >= cards.length) return;
      setFlippedStates((prev) => ({ ...prev, [currentIndex]: false }));
      setTimeout(() => {
        setCurrentIndex(next);
        setAnimKey((k) => k + 1);
      }, 120);
    },
    [currentIndex, flashCards.content]
  );

  const jumpTo = useCallback(
    (i) => {
      if (i === currentIndex) return;
      setFlippedStates((prev) => ({ ...prev, [currentIndex]: false }));
      setTimeout(() => {
        setCurrentIndex(i);
        setAnimKey((k) => k + 1);
      }, 120);
    },
    [currentIndex]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === " ") {
        e.preventDefault();
        handleClick(currentIndex);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, currentIndex]);

  const cards = flashCards.content || [];
  const card = cards[currentIndex];

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className=" text-center mb-10">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">
          study tool
        </p>
        <h2 className="text-3xl font-bold text-gray-800">Flashcards</h2>
        <p className="text-sm text-gray-500 mt-1">
          Help you to remember your concepts
        </p>
      </div>

      {loading ? (
        <div className="w-[380px] max-w-[90vw] h-[260px] rounded-2xl bg-gray-200 animate-pulse" />
      ) : cards.length === 0 ? (
        <p className="text-gray-500">No flashcards found.</p>
      ) : (
        <>
          {/* Card with slide-up animation */}
          <div
            key={animKey}
            className="animate-slideUp"
          >
            <FlashcardItem
              isFlipped={!!flippedStates[currentIndex]}
              handleClick={() => handleClick(currentIndex)}
              flashCard={card}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => navigate(-1)}
              disabled={currentIndex === 0}
              className="btn btn-outline-primary w-11 h-11 rounded-full !p-0 text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous card"
            >
              ←
            </button>

            <div className="flex gap-1.5 items-center max-w-[200px] flex-wrap justify-center">
              {cards.map((_, i) => (
                <div
                  key={i}
                  onClick={() => jumpTo(i)}
                  className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    i === currentIndex
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              disabled={currentIndex === cards.length - 1}
              className="btn btn-outline-primary w-11 h-11 rounded-full !p-0 text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next card"
            >
              →
            </button>
          </div>

          {/* Counter & hint */}
          <p className="text-xs text-gray-400 mt-3 tracking-wide">
            {currentIndex + 1} / {cards.length}
          </p>
          <p className="text-[10px] text-gray-900 mt-6 tracking-wide">
            ← → navigate · space or click to flip
          </p>
        </>
      )}
    </div>
  );
}

export default Flashcards;
