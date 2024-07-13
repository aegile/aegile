"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { CourseMember } from "@/lib/types";
import { clientFetch } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AlertDeleteDialog from "@/components/alert-delete-dialog";

import { roles } from "./data";

// import { taskSchema } from '../data/schema';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  const user = row.original as CourseMember;
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const { course_id } = useParams();

  async function switchRole(role: string) {
    await clientFetch(
      `/api/courses/${course_id}/enrolments/${user.id}`,
      "PUT",
      { role },
    )
      .then((data) => {
        toast.success("Member role changed successfully!");
        router.refresh();
      })
      .catch((error) => toast.error(error.message));
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="ml-auto flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={user.role || undefined}>
                {roles.map((role) => (
                  <DropdownMenuRadioItem
                    key={role.value}
                    value={role.value ? role.value : ""}
                    className="justify-start"
                    onSelect={() => switchRole(role.value)}
                  >
                    {role.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-400"
          >
            Kick
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDeleteDialog
        deleteRoute={`/api/courses/${course_id}/enrolments/${user.id}`}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
      />
    </>
  );
}
