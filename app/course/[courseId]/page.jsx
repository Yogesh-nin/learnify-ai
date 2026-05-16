"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardHeader from "../../dashboard/_components/DashboardHeader";
import axios from "axios";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";

function Course() {
  const { courseId } = useParams();
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);

  const GetCourse = async () => {
    try {
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      setCourseData(result.data.result);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404 || status === 401) {
        setError("This course does not exist or you do not have access to it.");
        router.replace("/dashboard");
        return;
      }
      console.error("Error fetching course:", err.message);
      setError("Failed to load course data.");
    }
  };

  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!courseData) {
    return <div>Loading course details...</div>;
  }

  return (
    <div className="min-h-screen">
      <div>
        <CourseIntroCard course={courseData} />
        <StudyMaterialSection courseId={courseId} course={courseData}/>
        <ChapterList course={courseData} />
      </div>
    </div>
  );
}

export default Course;
