"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import type { PaginationMeta } from "../app/_components/PaginationControls";

interface Course {
  courseId: string;
  courseLayout: {
    courseTitle: string;
    courseSummary?: string;
  };
  status: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 6;
const POLL_MAX_SIZE = 50;

interface CourseContextType {
  courseList: Course[];
  loading: boolean;
  error: string | null;
  deletingCourseId: string | null;
  pagination: PaginationMeta;
  fetchCourses: (page?: number) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addCourse: (course: Course) => void;
}

const defaultPagination: PaginationMeta = {
  page: DEFAULT_PAGE,
  size: DEFAULT_SIZE,
  total: 0,
  totalPages: 1,
  hasMore: false,
};

const CourseContext = createContext<CourseContextType | null>(null);

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<PaginationMeta>(defaultPagination);

  const pageRef = useRef(DEFAULT_PAGE);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCourses = useCallback(
    async (page = DEFAULT_PAGE) => {
      if (!user) return;

      pageRef.current = page;
      setLoading(true);
      setError(null);
      try {
        const result = await axios.get("/api/courses", {
          params: { page, size: DEFAULT_SIZE },
        });
        setCourseList(result.data.result ?? []);
        setPagination(result.data.pagination ?? defaultPagination);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const pollCourses = useCallback(async () => {
    if (!user) return;
    try {
      const result = await axios.get("/api/courses", {
        params: { page: 1, size: POLL_MAX_SIZE },
      });
      const polled: Course[] = result.data.result ?? [];
      setCourseList((prev) => {
        const currentPage = pageRef.current;
        if (currentPage === 1) {
          return polled.slice(0, DEFAULT_SIZE);
        }
        return prev.map((course) => {
          const updated = polled.find((c) => c.courseId === course.courseId);
          return updated ?? course;
        });
      });
      if (pageRef.current === 1) {
        setPagination(result.data.pagination ?? defaultPagination);
      }
    } catch {
      // Silent fail during polling
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

  const deleteCourse = useCallback(
    async (courseId: string) => {
      setDeletingCourseId(courseId);
      try {
        await axios.delete(`/api/courses?courseId=${courseId}`);
        const remainingOnPage = courseList.filter((c) => c.courseId !== courseId);
        if (remainingOnPage.length === 0 && pagination.page > 1) {
          await fetchCourses(pagination.page - 1);
        } else {
          setCourseList(remainingOnPage);
          setPagination((prev) => ({
            ...prev,
            total: Math.max(0, prev.total - 1),
          }));
        }
        toast.success("Course deleted successfully.");
      } catch (err) {
        console.error("Error deleting course:", err);
        toast.error("Failed to delete course. Please try again.");
      } finally {
        setDeletingCourseId(null);
      }
    },
    [courseList, fetchCourses, pagination.page]
  );

  const addCourse = useCallback((course: Course) => {
    setCourseList((prev) => [course, ...prev]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
  }, []);

  useEffect(() => {
    if (user) fetchCourses(DEFAULT_PAGE);
  }, [user, fetchCourses]);

  return (
    <CourseContext.Provider
      value={{
        courseList,
        loading,
        error,
        deletingCourseId,
        pagination,
        fetchCourses,
        deleteCourse,
        addCourse,
      }}
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
