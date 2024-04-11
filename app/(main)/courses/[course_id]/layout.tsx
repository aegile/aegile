import { Metadata } from 'next';
import { fetchServerAPIRequest } from '@/lib/server-utils';
import { CourseNav } from './_components/course-nav';
import { Course } from '@/lib/types';
import CourseNavCollapsedMenu from './course-nav-collapsed-menu';
import Link from 'next/link';
import CourseNavMenu from './_components/course-nav-menu';

// async function getCourse(course_id: string) {
//   const res = await fetchServerAPIRequest(
//     `/api/v1/courses/${course_id}`,
//     'GET'
//   );
//   if (res.status === 401)
//     throw new Error("You don't have permission to view this page.");
//   if (res.status === 403)
//     throw new Error('You are not authorized to view this page.');

//   const data = await res.json();
//   return data;
// }

export default async function CourseLayout({
  params,
  children,
}: {
  params: { course_id: string };
  children: React.ReactNode;
}) {
  // const course: Course = await getCourse(params.course_id);
  return (
    <>
      <CourseNavMenu course_id={params.course_id} />
      <CourseNavCollapsedMenu course_id={params.course_id} />
      {children}
    </>
  );
}
