import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { LayoutGrid, LayoutList } from 'lucide-react';

import CourseGridCard from './course-grid-card';
import CourseListCard from './course-list-card';
import DataNotFound from '@/components/page-ui/data-not-found';

import { CourseCreationDialog } from './course-creation-dialog';

export default function CoursesMain({ courses }: { courses: Course[] }) {
  return (
    <Tabs defaultValue="grid-view" className="h-full">
      <Card className="w-full flex flex-col h-full">
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>View and manage your courses.</CardDescription>
          <div className="flex items-center ml-auto space-x-2">
            <CourseCreationDialog />
            <TabsList>
              <TabsTrigger value="grid-view">
                <LayoutGrid className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="list-view">
                <LayoutList className="w-5 h-5" />
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent
          className="h-full overflow-y-auto"
          style={{ scrollbarGutter: 'stable' }}
        >
          {!courses.length ? (
            <DataNotFound dataName="courses" />
          ) : (
            <>
              <TabsContent value="grid-view">
                <div className="grid w-full gap-6 auto-rows-min sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
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
        </CardContent>
      </Card>
    </Tabs>
  );
}
