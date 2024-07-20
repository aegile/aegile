"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ShieldCheckIcon, UserIcon, UserPlusIcon } from "lucide-react";

import { Participant } from "@/lib/schemas";
import { DataTableFilterField, TutorialMember, User } from "@/lib/types";
import { useDataTable } from "@/hooks/use-data-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { getColumns } from "./columns";
import { MembersTableToolbarActions } from "./members-table-toolbar-actions";

interface MembersTableProps {
  members: TutorialMember[];
  candidates: User[];
  assignments: { id: string; name: string }[];
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
  assignments,
}: MembersTableProps) {
  const [selectedAssignment, setSelectedAssignment] = React.useState<string>(
    assignments[0]?.id || "",
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const ass_id = searchParams.get("ass_id");

  const columns = React.useMemo(() => getColumns(), []);
  const filterFields: DataTableFilterField<TutorialMember>[] = [
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

  const { table } = useDataTable({
    data: members,
    columns,
    visibility: {
      id: false,
    },
  });
  return (
    <>
      <Select
        value={ass_id || undefined}
        onValueChange={(value) => router.push(`${pathname}?ass_id=${value}`)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select assignment" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Assignment</SelectLabel>
            {assignments.map((assignment) => (
              <SelectItem value={assignment.id} key={assignment.id}>
                {"\t" + assignment.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <MembersTableToolbarActions
            table={table}
            enrollableUsers={candidates}
          />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}
