import { Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { fetchServerAPIRequest } from '@/lib/server-utils';
import { User } from '@/lib/types';

import EnrolParticipantsForm from './enrol-participants-form';

// async function getEnrollableUsers(course_id: string) {
//   const res = await fetchServerAPIRequest(
//     `/api/v1/courses/${course_id}/enrollable-users`,
//     'GET'
//   );
//   if (res.status === 401)
//     throw new Error("You don't have permission to view this page.");
//   if (res.status === 403)
//     throw new Error('You are not authorized to view this page.');

//   const data = await res.json();
//   return data;
// }

export function EnrolParticipantsDialog({ course_id }: { course_id: string }) {
  // const enrollableUsers = await getEnrollableUsers(course_id);
  const enrollableUsers: User[] = [];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Enrol Participants
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enrol Participants</DialogTitle>
          <DialogDescription>
            Enrol existing and verified users to this course.
          </DialogDescription>
        </DialogHeader>
        <EnrolParticipantsForm enrollableUsers={enrollableUsers} />
      </DialogContent>
    </Dialog>
  );
}
