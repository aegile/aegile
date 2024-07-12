"use client";

import { ColumnDef } from "@tanstack/react-table";



// import { labels, priorities, statuses } from '../data/data';
import { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";



import { roles } from "./data";
import { DataTableRowActions } from "./tutorial_participants-row-actions";


export function getColumns(): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="User" />
    //   ),
    //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "first_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate font-medium">
          {row.getValue("first_name")}
        </div>
      ),
      filterFn: (row, id, value) => {
        const rowValue: string = row.getValue(id);
        return value.some((letter: string) =>
          rowValue.toLowerCase().startsWith(letter.toLowerCase()),
        );
      },
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate font-medium">
          {row.getValue("last_name")}
        </div>
      ),
      filterFn: (row, id, value) => {
        const rowValue: string = row.getValue(id);
        return value.some((letter: string) =>
          rowValue.toLowerCase().startsWith(letter.toLowerCase()),
        );
      },
    },
    {
      accessorKey: "handle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="zID" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate font-medium">
          {row.getValue("handle")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate font-medium">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = roles.find((role) => role.value === row.getValue("role"));

        if (!role) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {role.icon && (
              <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{role.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];
}