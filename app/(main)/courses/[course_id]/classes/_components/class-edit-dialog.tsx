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

export function ClassEditDialog({
  item,
  open,
  setIsOpen,
}: {
  item: Class;
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { id, name, capacity, member_count, day, times, location } = item;
  const [start_time, end_time] = times.split(' - ');
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit class details</DialogTitle>
          <DialogDescription>
            Edit the details for this class. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <ClassForm
          defaultValues={{
            name,
            capacity,
            day,
            start_time,
            end_time,
            location,
          }}
          fetchRoute={`/api/v1/tutorials/${id}`}
          method="PUT"
        />
      </DialogContent>
    </Dialog>
  );
}
