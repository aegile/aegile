"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { TutorialMember, User } from "@/lib/types";
import { Button } from "@/components/ui/button";

import { EnrolParticipantsDialog } from "./enrol-participants-dialog";
import { ProjectGroupAssignmentCombobox } from "./project-group-assignment-combobox";

// import { CreateTaskDialog } from "./create-task-dialog";
// import { DeleteTasksDialog } from "./delete-tasks-dialog";

interface MembersTableToolbarActionsProps {
  table: Table<TutorialMember>;
  enrollableUsers: User[];
}

export function MembersTableToolbarActions({
  table,
  enrollableUsers = [],
}: MembersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <ProjectGroupAssignmentCombobox table={table} />
      ) : null}
      <EnrolParticipantsDialog enrollableUsers={enrollableUsers} />
      <Button variant="outline" size="xs">
        <DownloadIcon className="size-4 mr-2" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
