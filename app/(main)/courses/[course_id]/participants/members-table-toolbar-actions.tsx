"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Participant } from "@/lib/schemas";
import { CourseMember, User } from "@/lib/types";
import { Button } from "@/components/ui/button";

import { EnrolParticipantsDialog } from "./enrol-participants-dialog";

// import { CreateTaskDialog } from "./create-task-dialog";
// import { DeleteTasksDialog } from "./delete-tasks-dialog";

interface MembersTableToolbarActionsProps {
  table: Table<CourseMember>;
  enrollableUsers: User[];
}

export function MembersTableToolbarActions({
  table,
  enrollableUsers = [],
}: MembersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button size="xs">Delete</Button>
      ) : null}
      <EnrolParticipantsDialog enrollableUsers={enrollableUsers} />
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
