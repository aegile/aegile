import { Metadata } from 'next';
import { fetchServerAPIRequest } from '@/lib/utils';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { LayoutGrid, LayoutList } from 'lucide-react';

import CourseGridCard from './_components/course-grid-card';
import CourseListCard from './_components/course-list-card';

async function getCourses() {
  const token = getCookie('accessToken', { cookies }) || '';
  // try {
  //   return await fetchServerAPIRequest('/api/v1/courses', 'GET', token);
  // } catch (error) {
  //   const err = error as Error;
  //   return { error: err.message };
  // }
}

export const metadata: Metadata = {
  title: 'My Courses',
};

const courses = [
  {
    id: '1',
    term: '23T3',
    code: 'COMP1511',
    name: 'Programming Fundamentals',
    deliverables: 2,
  },
  {
    id: '2',
    term: '23T3',
    code: 'COMP1521',
    name: 'Computer Systems Fundamentals',
    deliverables: 2,
  },
  {
    id: '3',
    term: '23T3',
    code: 'COMP1531',
    name: 'Software Engineering Fundamentals',
    deliverables: 2,
  },
  {
    id: '4',
    term: '23T3',
    code: 'COMP2521',
    name: 'Data Structures and Algorithms',
    deliverables: 2,
  },
  {
    id: '5',
    term: '23T3',
    code: 'COMP2511',
    name: 'Object-Oriented Design & Programming',
    deliverables: 2,
  },
  {
    id: '6',
    term: '23T3',
    code: 'COMP3121',
    name: 'Algorithms and Programming Techniques',
    deliverables: 2,
  },
  {
    id: '7',
    term: '23T3',
    code: 'COMP3141',
    name: 'Software System Design and Implementation',
    deliverables: 2,
  },
  {
    id: '8',
    term: '23T3',
    code: 'COMP3151',
    name: 'Foundations of Concurrency',
    deliverables: 2,
  },
  {
    id: '9',
    term: '23T3',
    code: 'COMP3161',
    name: 'Software Quality Engineering',
    deliverables: 2,
  },
  {
    id: '10',
    term: '23T3',
    code: 'COMP3891',
    name: 'Extended Operating Systems',
    deliverables: 2,
  },
  {
    id: '11',
    term: '23T3',
    code: 'COMP3821',
    name: 'Extended Algorithms and Programming Techniques',
    deliverables: 2,
  },
  {
    id: '12',
    term: '23T3',
    code: 'COMP6080',
    name: 'Web Front-End Programming',
    deliverables: 2,
  },
];

export default async function CoursesPage() {
  // TODO
  // const courses = await getCourses();

  return (
    <div className="h-full space-y-4 p-8 overflow-y-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
        <div className="flex items-center space-x-2">
          <Button>TODO</Button>
        </div>
      </div>
      <Tabs defaultValue="list-view" className="space-y-4">
        <TabsList className="ml-auto">
          <TabsTrigger value="grid-view">
            <LayoutGrid className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="list-view">
            <LayoutList className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid-view">
          <div className="grid auto-rows-min w-full gap-6 md:grid-cols-2 xl:grid-cols-4">
            {courses.map((course, index) => (
              <CourseGridCard
                key={index}
                id={course.id}
                term={course.term}
                code={course.code}
                name={course.name}
                deliverables={course.deliverables}
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
                deliverables={course.deliverables}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
