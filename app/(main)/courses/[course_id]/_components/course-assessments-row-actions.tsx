'use client';

import React from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dropdown-menu';
import AlertDeleteDialog from '@/components/alert-delete-dialog';
import { courseEnrolmentSchema } from '@/lib/schemas';
import { useParams } from 'next/navigation';

// import { roles } from './data';
// import { taskSchema } from '../data/schema';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const user = courseEnrolmentSchema.parse(row.original);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  // const { course_id } = useParams();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted ml-auto"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={user.role || undefined}>
                {roles.map((role) => (
                  <DropdownMenuRadioItem
                    key={role.value}
                    value={role.value}
                    className="justify-start"
                  >
                    {role.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-400"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDeleteDialog
        deleteRoute={"this is a dummy route"}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
      />
    </>
  );
}
