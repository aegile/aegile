import { Metadata } from 'next';
import { fetchServerAPIRequest } from '@/lib/server-utils';
import { CourseNav } from './_components/course-nav';
import { Course } from '@/lib/types';

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
    // <div className="h-full flex flex-col p-8 space-y-6 overflow-y-auto">
    //   <div className="flex items-center justify-between">
    //     <h2 className="text-3xl font-semibold tracking-tight">
    //       {/* {course.code}: {course.name} ({course.term}) */}
    //     </h2>
    //   </div>
    //   {/* <CourseNav course_id={params.course_id} /> */}
    // </div>
    <>{children}</>
  );
}
