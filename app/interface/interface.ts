export interface CourseLayout {
  courseTitle?: string;
  courseSummary?: string;
}

export interface CourseInterface {
  courseId: string;
  courseLayout?: CourseLayout;
  status: string;
}
