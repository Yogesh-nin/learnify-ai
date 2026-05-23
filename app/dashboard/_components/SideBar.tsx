"use client";

import React, { memo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  NotebookPen,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCourses } from "../../../context/CourseContext";

interface SideBarProps {
  onClose?: () => void;
}

const isDashboardActive = (path: string) => path === "/dashboard";
const isNotesActive = (path: string) =>
  path === "/dashboard/notes" || path.startsWith("/dashboard/notes/");

const SideBarHeader = memo(function SideBarHeader({
  onClose,
}: {
  onClose?: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img src="/logo-main.svg" alt="logo" width={40} height={40} />
        <h2 className="font-bold text-2xl">Learnify</h2>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden p-1 hover:bg-surface-muted rounded-lg"
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
});

const CreateNewButton = memo(function CreateNewButton({
  onClose,
}: {
  onClose?: () => void;
}) {
  return (
    <Link href="/create" className="w-full" onClick={onClose}>
      <button className="btn btn-outline-primary w-full">+ Create New</button>
    </Link>
  );
});

const NavItem = memo(function NavItem({
  href,
  name,
  icon: Icon,
  isActive,
  onClose,
}: {
  href: string;
  name: string;
  icon: LucideIcon;
  isActive: (path: string) => boolean;
  onClose?: () => void;
}) {
  const path = usePathname();
  const active = isActive(path);

  return (
    <Link href={href} onClick={onClose}>
      <div
        className={`flex gap-5 items-center p-3 hover:bg-surface-hover rounded-lg cursor-pointer mt-3 ${
          active ? "bg-surface-hover" : ""
        }`}
      >
        <Icon />
        <h2>{name}</h2>
      </div>
    </Link>
  );
});

const CourseNavItem = memo(function CourseNavItem({
  courseId,
  title,
  onClose,
}: {
  courseId: string;
  title: string;
  onClose?: () => void;
}) {
  const path = usePathname();
  const href = `/course/${courseId}`;
  const active = path === href;

  return (
    <Link href={href} onClick={onClose}>
      <div
        className={`flex items-center gap-2 py-2 px-2 rounded-md hover:bg-surface-hover cursor-pointer text-sm ${
          active ? "bg-surface-hover font-semibold" : ""
        }`}
      >
        <BookOpen size={14} className="shrink-0 text-muted" />
        <span className="line-clamp-1">{title}</span>
      </div>
    </Link>
  );
});

const CoursesSection = memo(function CoursesSection({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const { courseList, loading } = useCourses();

  return (
    <div className="mt-3">
      <div
        className={`flex gap-5 items-center p-3 hover:bg-surface-hover rounded-lg cursor-pointer select-none ${
          coursesOpen ? "bg-surface-muted" : ""
        }`}
        onClick={() => setCoursesOpen((prev) => !prev)}
      >
        <BookOpen size={20} />
        <h2 className="flex-1">Courses</h2>
        {coursesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>

      {coursesOpen && (
        <div className="ml-4 mt-1 border-l-2 border-border pl-3 flex flex-col gap-1">
          {loading ? (
            <p className="text-xs text-subtle py-2">Loading...</p>
          ) : courseList.length === 0 ? (
            <p className="text-xs text-subtle py-2">No courses yet.</p>
          ) : (
            courseList.map((course) => (
              <CourseNavItem
                key={course.courseId}
                courseId={course.courseId}
                title={course.courseLayout?.courseTitle ?? "Untitled"}
                onClose={onClose}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
});

function SideBar({ onClose }: SideBarProps) {
  return (
    <div className="h-screen shadow-md p-5 flex flex-col bg-surface">
      <SideBarHeader onClose={onClose} />
      <div className="mt-10 flex-1 overflow-y-auto">
        <CreateNewButton onClose={onClose} />
        <div className="mt-5">
          <NavItem
            href="/dashboard"
            name="Dashboard"
            icon={LayoutDashboard}
            isActive={isDashboardActive}
            onClose={onClose}
          />
          <CoursesSection onClose={onClose} />
          <NavItem
            href="/dashboard/notes"
            name="Notes"
            icon={NotebookPen}
            isActive={isNotesActive}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(SideBar);
