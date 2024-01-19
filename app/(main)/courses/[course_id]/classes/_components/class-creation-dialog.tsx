'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

import { ClassForm } from './class-form';

export function ClassCreationDialog() {
  const { course_id } = useParams();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a class</DialogTitle>
          <DialogDescription>
            Create a new class. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <ClassForm
          defaultValues={{
            name: 'H11A',
            capacity: 25,
            day: 'Mon',
            start_time: '11:00',
            end_time: '13:00',
            location: 'Quadrangle G047',
          }}
          fetchRoute={`/api/v1/tutorials/crs/${course_id}`}
          method="POST"
        />
      </DialogContent>
    </Dialog>
  );
}
