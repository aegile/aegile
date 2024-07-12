"use client";

import React from "react";

import { ShieldCheckIcon, UserIcon, UserPlusIcon } from "lucide-react";

import { Participant } from "@/lib/schemas";
import { DataTableFilterField, User } from "@/lib/types";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { getColumns } from "./columns";
import { MembersTableToolbarActions } from "./members-table-toolbar-actions";

interface MembersTableProps {
  members: User[];
  candidates: User[];
}

const roles = [
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheckIcon,
  },
  {
    value: "tutor",
    label: "Tutor",
    icon: UserPlusIcon,
  },
  {
    value: "student",
    label: "Student",
    icon: UserIcon,
  },
];

export default function MembersTable({
  members,
  candidates,
}: MembersTableProps) {
  const columns = React.useMemo(() => getColumns(), []);
  const filterFields: DataTableFilterField<Participant>[] = [
    {
      label: "Email",
      value: "email",
      placeholder: "Filter email...",
    },
    {
      label: "Roles",
      value: "role",
      options: roles.map((role) => ({
        ...role,
        withCount: true,
      })),
    },
  ];

  const { table } = useDataTable({ data: members, columns });
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <MembersTableToolbarActions
          table={table}
          enrollableUsers={candidates}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
