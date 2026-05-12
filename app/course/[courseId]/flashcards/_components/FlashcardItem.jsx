"use client";

import React from "react";

function FlashCardItem({ isFlipped, handleClick, flashCard }) {
  return (
    <div className="w-[380px] max-w-[90vw]" style={{ perspective: "1400px" }}>
      <div
        onClick={handleClick}
        className="relative w-full h-[260px] cursor-pointer select-none"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.65s cubic-bezier(0.34, 1.2, 0.64, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            {flashCard?.front}
          </p>
          <p className="mt-5 text-[10px] text-gray-400 tracking-wide">
            tap to reveal answer
          </p>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-primary p-8 text-center shadow-md"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-base text-white leading-relaxed">
            {flashCard?.back}
          </p>
          <p className="mt-5 text-[10px] text-white/40 tracking-wide">
            tap to flip back
          </p>
        </div>
      </div>
    </div>
  );
}

export default FlashCardItem;
