"use client";
import React, { useState } from "react";
import Loader from "./Loader";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import GenericModal from "./ModalComponent";
import { DeleteIcon } from "../../_components/icons/DeleteIcon";
import { useCourses } from "../../../context/CourseContext";

function CourseCardItem({ course }) {
  const { deleteCourse, deletingCourseId } = useCourses();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleting = deletingCourseId === course.courseId;

  const handleDelete = async () => {
    await deleteCourse(course.courseId);
    setDeleteOpen(false);
  };

  return (
    <>
      <div className="p-4 w-full border rounded-lg shadow-md bg-gray-100">
        <div className="flex flex-col justify-between h-full">
          <div className="h-full">
            <div className="flex items-center mb-4">
              <img
                src="/knowledge.png"
                alt="knowledge"
                width={50}
                height={50}
                className="mr-4"
              />
              <h2 className="text-lg font-semibold">
                {course.courseLayout.courseTitle}
              </h2>
            </div>

            <div className="text-sm mt-3 text-gray-600 bg-[#ededed] py-5 px-3 rounded-lg">
              <p className="line-clamp-4">
                {course.courseLayout.courseSummary}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end items-center gap-2">
            {course.status === "Generating" ? (
              <div className="flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <>
                <Link href={`course/${course.courseId}`}>
                  <button className="btn btn-outline-primary px-4 py-2">
                    View
                  </button>
                </Link>

                <div className="relative group">
                  <button
                    onClick={() => setDeleteOpen(true)}
                    disabled={deleting}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Delete course"
                  >
                    {deleting ? (
                      <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    Delete
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <GenericModal
        open={deleteOpen}
        icon={<DeleteIcon />}
        onClose={() => setDeleteOpen(false)}
        title="Delete Course Permanently ?"
        description="Are you sure you want to delete this course? It cannot be undone."
        actions={[
          { label: "Confirm", onClick: handleDelete, isLoading: deleting },
          {
            label: "Cancel",
            onClick: () => setDeleteOpen(false),
            variant: "outlined",
          },
        ]}
      />
    </>
  );
}

export default CourseCardItem;
