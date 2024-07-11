"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";

import { names, roles } from "./data";
import { EnrolParticipantsDialog } from "./enrol-participants-dialog";

interface DataTableToolbarProps<TData> {
  table?: Table<TData>;
  candidate?: TData[];
}

export function DataTableToolbar<TData>({
  table,
  candidate,
}: DataTableToolbarProps<TData>) {
  if (!table) return null;

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] bg-background lg:w-[250px]"
        />
        {table.getColumn("first_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("first_name")}
            title="First Name"
            options={names}
          />
        )}
        {table.getColumn("last_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("last_name")}
            title="Last Name"
            options={names}
          />
        )}
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roles}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <EnrolParticipantsDialog enrollableUsers={candidate as User[]} />
      </div>
    </div>
  );
}
