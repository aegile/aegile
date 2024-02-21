import { Metadata } from 'next';
import { fetchServerAPIRequest } from '@/lib/server-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Grid, LayoutGrid, LayoutList } from 'lucide-react';

import CourseGridCard from './_components/course-grid-card';
import CourseListCard from './_components/course-list-card';
import DataNotFound from '@/components/page-ui/data-not-found';

import { CourseCreationDialog } from './_components/course-creation-dialog';
import CoursesCalendar from './_components/courses-calendar';
import CoursesRecents from './_components/courses-recents';
import ErrorAlert from '@/components/error-alert';
import GridListViewCard from '@/components/grid-list-view-card';
import { Course } from '@/lib/types';

async function getCourses() {
  const res = await fetchServerAPIRequest('/api/v1/courses', 'GET');
  if (res.status === 401)
    return { error: "You don't have permission to view this page." };
  // throw new Error("You don't have permission to view this page.");

  const data = await res.json();
  return data;
}

export const metadata: Metadata = {
  title: 'My Courses',
};

export default async function CoursesPage() {
  const courses = await getCourses();
  if (courses.error) return <ErrorAlert error={courses} />;
  return (
    <div className="h-screen flex flex-col p-8 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">My Courses</h2>
      </div>
      <div className="flex-grow space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:grid-rows-2 gap-5 sm:overflow-y-auto">
        <div className="sm:col-span-2 lg:row-span-2">
          <GridListViewCard<Course>
            dataName="courses"
            items={courses}
            GridItemComponent={CourseGridCard}
            ListItemComponent={CourseListCard}
            ItemCreationComponent={CourseCreationDialog}
          />
        </div>
        <CoursesCalendar courses={courses} />
        <CoursesRecents courses={courses} />
      </div>
    </div>
  );
}
