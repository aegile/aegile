'use client';

import React from 'react';

import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CoursesCalendar({ courses }: { courses: Course[] }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Upcoming deadlines and events.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow  overflow-y-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="flex w-full justify-center"
        />
      </CardContent>
    </Card>
  );
}
