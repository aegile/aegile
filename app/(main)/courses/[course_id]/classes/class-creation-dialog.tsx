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
import { ClassCreationForm } from './class-creation-form';

import { PlusCircle } from 'lucide-react';

export function ClassCreationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a class</DialogTitle>
          <DialogDescription>
            Create a new class. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <ClassCreationForm />
      </DialogContent>
    </Dialog>
  );
}
