import { addHours, format, formatDistanceToNow } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { ClassInbox } from './_components/class-inbox';

// async function getTutorials(course_id: string) {
//   const res = await fetchServerAPIRequest(
//     `/api/v1/tutorials/crs/${course_id}`,
//     'GET'
//   );
//   if (res.status === 401)
//     throw new Error("You don't have permission to view this page.");
//   if (res.status === 400)
//     return { error: "The course you are attempting to access doesn't exist." };
//   const data = await res.json();
//   return data;
// }

function CardComponent({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Classes</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 ">{children}</CardContent>
    </Card>
  );
}

export default async function CourseClassesPage({
  params,
}: {
  params: { course_id: string };
}) {
  // const tutorials: Tutorial[] = await getTutorials(params.course_id);
  return (
    // <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row">
    <main className="grid flex-grow flex-1 gap-4 bg-muted/40 p-4 pb-0 sm:px-6 md:gap-8">
      <ClassInbox />
    </main>
  );
}
