import { fetchServerAPIRequest } from '@/lib/server-utils';

import { Button } from '@/components/ui/button';
import { CircleIcon, StarIcon, Presentation } from 'lucide-react';
import UpcomingClasses from './_components/upcoming-classes';
import { ClassCreationDialog } from './_components/class-creation-dialog';
import GridListViewCard from '@/components/grid-list-view-card';
import ClassGridCard from './_components/class-grid-card';
import { DemoGithub } from './_components/class-card';
import { addHours, format, formatDistanceToNow } from 'date-fns';
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
import { ScrollArea } from '@/components/ui/scroll-area';

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

type Tutorial = {
  id: string;
  name: string;
  capacity: number;
  member_count: number;
  datetime: Date;
  location: string;
};

export default async function CourseClassesPage({
  params,
}: {
  params: { course_id: string };
}) {
  // const tutorials: Tutorial[] = await getTutorials(params.course_id);
  const tutorials: Tutorial[] = [
    {
      id: '0',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), -3),
      location: 'Zoom',
    },
    {
      id: '1',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), 1),
      location: 'Zoom',
    },
    {
      id: '2',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), 2),
      location: 'Zoom',
    },
    {
      id: '3',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), 2),
      location: 'Zoom',
    },
    {
      id: '4',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), 2),
      location: 'Zoom',
    },
    {
      id: '5',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), 2),
      location: 'Zoom',
    },
    {
      id: '6',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), 2),
      location: 'Zoom',
    },
    {
      id: '7',
      name: 'H14A',
      member_count: 20,
      capacity: 25,
      datetime: addHours(new Date(), 2),
      location: 'Zoom',
    },
  ];
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 max-h-min items-start">
      {/* <GridListViewCard
          dataName="classes"
          items={tutorials}
          GridItemComponent={ClassGridCard}
          ListItemComponent={() => <></>}
          ItemCreationComponent={ClassCreationDialog}
        /> */}
      <ScrollArea className="h-[calc(100vh-8.5rem)]">
        {tutorials
          .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
          .map((tut) => (
            <div className="flex flex-col gap-2 p-4 pt-0 pl-0" key={tut.id}>
              <button
                key={tut.id}
                className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all duration-300 bg-background/80 hover:bg-accent"
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{tut.name}</div>
                      {/* <span className="flex h-2 w-2 rounded-full bg-blue-600" /> */}
                    </div>
                    <div className="ml-auto text-xs">
                      {formatDistanceToNow(tut.datetime, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="font-light">
                    {/* {tut.day} {tut.times} */}
                    {format(tut.datetime, 'EEEE haaa')}, @ {tut.location}
                  </div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground flex space-x-2">
                  <div className="flex items-center">
                    <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                    TypeScript
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="mr-1 h-3 w-3" />
                    20k
                  </div>
                  <div>Updated April 2023</div>
                </div>
                <div className="flex items-center gap-2">
                  {/* // <Badge key={label} variant={getBadgeVariantFromLabel(label)}> */}
                  <Badge variant="secondary">Hayden Smith</Badge>
                  <Badge variant="secondary">Joanna Lee</Badge>
                </div>
              </button>
            </div>
          ))}
      </ScrollArea>

      <ScrollArea className="h-[calc(100vh-8.5rem)]">
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
        <CardComponent>What to put here?</CardComponent>
      </ScrollArea>
      <CardComponent>
        Each of the following should be a tutorial class card. But since
        students only have one class and tutors having surely leq 5.
        <DemoGithub />
        <DemoGithub />
        <DemoGithub />
      </CardComponent>
      {/* <UpcomingClasses tutorials={tutorials} /> */}
    </main>
  );
}
