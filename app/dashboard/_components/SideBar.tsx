"use client"
import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, LayoutDashboard, LeafyGreenIcon, UserCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCourses } from '../../../context/CourseContext';

interface SideBarProps {
  onClose?: () => void;
}

function SideBar({ onClose }: SideBarProps) {
  const path = usePathname();
  const [coursesOpen, setCoursesOpen] = useState(false);
  const { courseList, loading } = useCourses();

  const staticMenuList = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'MathAi',
      icon: LeafyGreenIcon,
      path: 'http://localhost:5173/',
    },
    {
      name: 'Profile',
      icon: UserCircle,
      path: '/dashboard/profile',
    },
  ];

  return (
    <div className="h-screen shadow-md p-5 flex flex-col bg-white">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img src="/logo.svg" alt="logo" width={40} height={40} />
          <h2 className="font-bold text-2xl">TutorAi</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="mt-10 flex-1 overflow-y-auto">
        <Link href='/create' className='w-full' onClick={onClose}>
          <button className="btn btn-outline-primary w-full">+ Create New</button>
        </Link>

        <div className='mt-5'>
          {staticMenuList.slice(0, 1).map((menu, index) => (
            <Link key={index} href={menu.path} onClick={onClose}>
              <div className={`flex gap-5 items-center p-3 hover:bg-gray-300 rounded-lg cursor-pointer mt-3 ${path === menu.path && 'bg-gray-300'}`}>
                <menu.icon />
                <h2>{menu.name}</h2>
              </div>
            </Link>
          ))}

          {/* Courses dropdown */}
          <div className="mt-3">
            <div
              className={`flex gap-5 items-center p-3 hover:bg-gray-300 rounded-lg cursor-pointer select-none ${coursesOpen ? 'bg-gray-200' : ''}`}
              onClick={() => setCoursesOpen((prev) => !prev)}
            >
              <BookOpen size={20} />
              <h2 className="flex-1">Courses</h2>
              {coursesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {coursesOpen && (
              <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-3 flex flex-col gap-1">
                {loading ? (
                  <p className="text-xs text-gray-400 py-2">Loading...</p>
                ) : courseList.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2">No courses yet.</p>
                ) : (
                  courseList.map((course) => (
                    <Link key={course.courseId} href={`/course/${course.courseId}`} onClick={onClose}>
                      <div className={`flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-300 cursor-pointer text-sm ${path === `/course/${course.courseId}` ? 'bg-gray-300 font-semibold' : ''}`}>
                        <BookOpen size={14} className="shrink-0 text-gray-500" />
                        <span className="line-clamp-1">{course.courseLayout?.courseTitle ?? 'Untitled'}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {staticMenuList.slice(1).map((menu, index) => (
            <Link key={index} href={menu.path} onClick={onClose}>
              <div className={`flex gap-5 items-center p-3 hover:bg-gray-300 rounded-lg cursor-pointer mt-3 ${path === menu.path && 'bg-gray-300'}`}>
                <menu.icon />
                <h2>{menu.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar
