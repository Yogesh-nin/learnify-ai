"use client";

import React from "react";
import CourseCardItem from "./CourseCardItem";
import CourseCardSkeleton from "./CourseCardSkeleton";
import { useCourses } from "../../../context/CourseContext";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

const SKELETON_COUNT = 6;

function CourseList() {
  const { courseList, loading, error } = useCourses();

  if (error) return <div>{error}</div>;

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl">Your Study Material</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-2 gap-3 md:gap-5">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courseList.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-white py-16 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <BookOpenIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">No study material yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first AI-powered course.
            </p>
          </div>
          <Link href="/create">
            <button className="mt-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              + Create Course
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-2 gap-3 md:gap-5">
          {courseList.map((course, index) => (
            <CourseCardItem
              course={course}
              key={course.courseId ?? index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
