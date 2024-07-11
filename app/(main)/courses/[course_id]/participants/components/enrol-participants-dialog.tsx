import { getCookie } from "cookies-next";
import { Users } from "lucide-react";

import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EnrolParticipantsForm from "./enrol-participants-form";

export function EnrolParticipantsDialog({
  enrollableUsers,
}: {
  enrollableUsers: User[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="xs">
          <Users className="mr-2 h-4 w-4" />
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
