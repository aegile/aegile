import { fetchServerAPIRequest } from '@/lib/server-utils';

import { Button } from '@/components/ui/button';
import { Presentation } from 'lucide-react';
import UpcomingClasses from './_components/upcoming-classes';
import { ClassCreationDialog } from './_components/class-creation-dialog';
import GridListViewCard from '@/components/grid-list-view-card';
import ClassGridCard from './_components/class-grid-card';
import { Tutorial } from '@/lib/types';
import { DemoGithub } from './_components/class-card';

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

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';

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
  const tutorials: Tutorial[] = [];

  return (
    <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 max-h-min items-start">
      {/* <GridListViewCard
          dataName="classes"
          items={tutorials}
          GridItemComponent={ClassGridCard}
          ListItemComponent={() => <></>}
          ItemCreationComponent={ClassCreationDialog}
        /> */}
      <CardComponent>
        Each of the following should be a tutorial class card. But since
        students only have one class and tutors having surely leq 5.
        <DemoGithub />
        <DemoGithub />
        <DemoGithub />
        <DemoGithub />
        <DemoGithub />
      </CardComponent>
      <CardComponent>What to put here?</CardComponent>
      <UpcomingClasses tutorials={tutorials} />
    </main>
  );
}
