'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DropdownSettings } from '@/components/dropdown-settings';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClassForm } from './class-form';
import { ClassEditDialog } from './class-edit-dialog';

export default function ClassGridCard({ item }: { item: Tutorial }) {
  const { id, name, capacity, member_count, day, times, location } = item;
  const { course_id } = useParams();

  return (
    <Link href={`/classes/${id}`}>
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{name}</CardTitle>
            <DropdownSettings
              editItem={item}
              EditDialog={ClassEditDialog}
              deleteRoute={`/api/v1/tutorials/${id}`}
            />
          </div>
          <CardDescription className="font-semibold leading-7">
            {day}, {times}
            <br />
            {location} <br />
            Capacity: {capacity}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col">
          <div className="w-full flex justify-between">
            <p className="leading-7 text-sm text-muted-foreground">Capacity</p>
            <p className="leading-7 text-sm text-muted-foreground">
              {(member_count / capacity) * 100}%
            </p>
          </div>
          <Progress value={(member_count / capacity) * 100} />
        </CardFooter>
      </Card>
    </Link>
  );
}
