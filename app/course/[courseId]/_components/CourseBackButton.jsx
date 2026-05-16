"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function CourseBackButton({ className = "" }) {
  const { courseId } = useParams();

  return (
    <Link
      href={`/course/${courseId}`}
      className={`inline-flex items-center gap-2 btn btn-outline-primary text-sm ${className}`}
    >
      <ArrowLeft size={18} strokeWidth={2} />
      Back to course
    </Link>
  );
}

export default CourseBackButton;
