import { Metadata } from 'next';
import { fetchServerAPIRequest } from '@/lib/server-utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { LayoutGrid, LayoutList } from 'lucide-react';

import CourseGridCard from './_components/course-grid-card';
import CourseListCard from './_components/course-list-card';
import DataNotFound from '@/components/page-ui/data-not-found';

import { CourseCreationDialog } from './_components/course-creation-dialog';

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
    <div className="h-full flex flex-col p-8 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">My Courses</h2>
      </div>
      <Tabs
        defaultValue="list-view"
        className="flex flex-col flex-grow space-y-4"
      >
        <div className="flex items-center  space-x-2">
          <TabsList className="">
            <TabsTrigger value="grid-view">
              <LayoutGrid className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="list-view">
              <LayoutList className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>
          <CourseCreationDialog />
        </div>
        {!courses.length ? (
          <DataNotFound dataName="courses" />
        ) : (
          <>
            <TabsContent value="grid-view">
              <div className="grid w-full gap-6 auto-rows-min md:grid-cols-2 xl:grid-cols-4">
                {courses.map((course, index) => (
                  <CourseGridCard
                    key={index}
                    id={course.id}
                    term={course.term}
                    code={course.code}
                    name={course.name}
                    member_count={course.member_count}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list-view">
              <div className="flex flex-col w-full gap-6">
                {courses.map((course, index) => (
                  <CourseListCard
                    key={index}
                    id={course.id}
                    term={course.term}
                    code={course.code}
                    name={course.name}
                    member_count={course.member_count}
                  />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
