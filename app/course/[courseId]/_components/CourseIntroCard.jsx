import React from "react";

function CourseIntroCard({ course }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center p-6 border shadow-md rounded-lg bg-surface-muted w-full mx-auto">

      <div className="w-[120px] flex flex-col justify-center items-center">
        <img
          src="/knowledge.png"
          alt="knowledge"
          width={70}
          height={70}
          className="mb-4"
        />
        <h2 className="text-xs text-primary font-semibold">
          Total Chapters: {course?.courseLayout?.chapters?.length ?? 0}
        </h2>
      </div>

      <div className="flex flex-col justify-between">
        <h2 className="font-bold text-xl text-foreground">
          {course?.courseLayout?.courseTitle ?? "Untitled Course"}
        </h2>
        <p className="text-muted text-sm mt-2">
          {course?.courseLayout?.courseSummary ?? ""}
        </p>
      </div>
    </div>
  );
}

export default CourseIntroCard;
