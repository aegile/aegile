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
import { CourseCreationForm } from './course-creation-form';

import { PlusCircle } from 'lucide-react';

export function CourseCreationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a course</DialogTitle>
          <DialogDescription>
            Create a new course. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <CourseCreationForm />
      </DialogContent>
    </Dialog>
  );
}
