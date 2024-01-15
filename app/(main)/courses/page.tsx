import { Metadata } from 'next';
import { fetchServerAPIRequest } from '@/lib/server-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { LayoutGrid, LayoutList } from 'lucide-react';

import CourseGridCard from './_components/course-grid-card';
import CourseListCard from './_components/course-list-card';
import DataNotFound from '@/components/page-ui/data-not-found';

import { CourseCreationDialog } from './_components/course-creation-dialog';
import CoursesMain from './_components/courses-main';
import CoursesCalendar from './_components/courses-calendar';
import CoursesRecents from './_components/courses-recents';

async function getCourses() {
  const res = await fetchServerAPIRequest('/api/v1/courses', 'GET');
  if (res.status === 401)
    throw new Error("You don't have permission to view this page.");

  const data = await res.json();
  return data;
}

export const metadata: Metadata = {
  title: 'My Courses',
};

export default async function CoursesPage() {
  const courses: Course[] = await getCourses();

  return (
    <div className="h-screen flex flex-col p-8 space-y-6 overflow-y-auto">
      {/* <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">My Courses</h2>
      </div> */}
      <div className="flex flex-wrap sm:grid sm:grid-cols-2 lg:grid-cols-3 grid-rows-4 sm:grid-rows-2 h-fit sm:h-full gap-5">
        <div className="w-full col-span-full lg:col-span-2 row-span-2 lg:row-span-full max-h-[500px] sm:max-h-full">
          <CoursesMain courses={courses} />
        </div>

        <CoursesCalendar courses={courses} />
        <CoursesRecents courses={courses} />
        {/* <div className="w-full h-full border border-lime-600">Recents</div> */}
      </div>
    </div>
  );
}
