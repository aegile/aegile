'use client';

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';

import { names } from './data';
// import { EnrolParticipantsDialog } from './components/enrol-participants-dialog';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter assessments..."
          value={(table.getColumn('assessment_name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('assessment_name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] bg-background"
        />
        {table.getColumn('type') && (
          <DataTableFacetedFilter
            column={table.getColumn('type')}
            title="Type"
            options={names}
          />
        )}
        {table.getColumn('due_date') && (
          <DataTableFacetedFilter
            column={table.getColumn('due_date')}
            title="Due Date"
            options={names}
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
      {/* <div className="flex flex-1 items-center space-x-2">
        <DataTableViewOptions table={table} />
        <EnrolParticipantsDialog course_id={'params.course_id'} />
      </div> */}
    </div>
  );
}
