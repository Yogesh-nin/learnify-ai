"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface Course {
  courseId: string;
  courseLayout: {
    courseTitle: string;
    courseSummary?: string;
  };
  status: string;
}

interface CourseContextType {
  courseList: Course[];
  loading: boolean;
  error: string | null;
  deletingCourseId: string | null;
  fetchCourses: () => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addCourse: (course: Course) => void;
}

const CourseContext = createContext<CourseContextType | null>(null);

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const result = await axios.post("/api/courses/", {
        createdBy: user.primaryEmailAddress?.emailAddress,
      });
      setCourseList(result.data.result ?? []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const pollCourses = useCallback(async () => {
    if (!user) return;
    try {
      const result = await axios.post("/api/courses/", {
        createdBy: user.primaryEmailAddress?.emailAddress,
      });
      setCourseList(result.data.result ?? []);
    } catch {
      // Silent fail during polling — don't overwrite error state
    }
  }, [user]);

  useEffect(() => {
    const hasGenerating = courseList.some((c) => c.status === "Generating");

    if (hasGenerating && !pollingRef.current) {
      pollingRef.current = setInterval(pollCourses, 5000);
    }

    if (!hasGenerating && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [courseList, pollCourses]);

  const deleteCourse = useCallback(async (courseId: string) => {
    setDeletingCourseId(courseId);
    try {
      await axios.delete(`/api/courses?courseId=${courseId}`);
      setCourseList((prev) => prev.filter((c) => c.courseId !== courseId));
      toast.success("Course deleted successfully.");
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Failed to delete course. Please try again.");
    } finally {
      setDeletingCourseId(null);
    }
  }, []);

  const addCourse = useCallback((course: Course) => {
    setCourseList((prev) => [course, ...prev]);
  }, []);

  useEffect(() => {
    if (user) fetchCourses();
  }, [user, fetchCourses]);

  return (
    <CourseContext.Provider
      value={{ courseList, loading, error, deletingCourseId, fetchCourses, deleteCourse, addCourse }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within CourseProvider");
  }
  return context;
};
