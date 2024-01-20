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
import EnrollParticipantsForm from './enroll-participants-form';

async function getEnrollableUsers(course_id: string) {
  const res = await fetchServerAPIRequest(
    `/api/v1/courses/${course_id}/enrollable-users`,
    'GET'
  );
  if (res.status === 401)
    throw new Error("You don't have permission to view this page.");
  if (res.status === 403)
    throw new Error('You are not authorized to view this page.');

  const data = await res.json();
  return data;
}

export async function EnrollParticipantsDialog({
  course_id,
}: {
  course_id: string;
}) {
  const enrollableUsers = await getEnrollableUsers(course_id);
  console.log(
    '🚀 ~ EnrollParticipantsDialog ~ enrollableUsers:',
    enrollableUsers
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add/Enroll Participants</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll Participants</DialogTitle>
          <DialogDescription>
            Enroll existing and verified users to this course.
          </DialogDescription>
        </DialogHeader>
        <EnrollParticipantsForm enrollableUsers={enrollableUsers} />
        {/* <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs> */}
      </DialogContent>
    </Dialog>
  );
}
