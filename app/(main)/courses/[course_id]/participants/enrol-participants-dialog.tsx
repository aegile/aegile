"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Users } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { CourseMember, User } from "@/lib/types";
import { clientFetch } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EnrolParticipantsDialog({
  enrollableUsers,
}: {
  enrollableUsers: User[];
}) {
  const router = useRouter();
  const { course_id } = useParams();

  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredUsers = enrollableUsers.filter((user: CourseMember) => {
    return (
      user.first_name.toLowerCase().includes(searchTerm) ||
      user.last_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  async function enrolUser(userId: string) {
    await clientFetch(`/api/courses/${course_id}/enrolments/${userId}`, "POST")
      .then((data) => {
        toast.success("Member enrolled successfully!");
        router.refresh();
      })
      .catch((error) => toast.error(error.message));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="xs">
          <Users className="mr-2 h-4 w-4" />
          Enrol Participants
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enrol Participants</DialogTitle>
          <DialogDescription>
            Enrol existing and verified users to this course.
          </DialogDescription>
        </DialogHeader>

        <Input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <ScrollArea className="max-h-[calc(100dvh-18rem)] pr-1">
          {!filteredUsers.length && (
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-400">No users found...</p>
            </div>
          )}
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-y-0 rounded-md p-2 hover:bg-muted/60"
            >
              <Avatar className="border">
                <AvatarImage src={user?.image} alt="@shadcn" />
                <AvatarFallback>
                  {user.first_name.charAt(0)}
                  {user.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className="mx-3 line-clamp-1 text-sm">
                {user.first_name} {user.last_name} - {user.email}
              </p>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => enrolUser(user.id)}
              >
                Add
              </Button>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
