'use client';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// import { labels, priorities, statuses } from '../data/data';
import { Assessment } from '@/lib/schemas';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableRowActions } from './course-assessments-row-actions';
// import { roles } from './data';

export const columns: ColumnDef<Assessment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
  {
    accessorKey: 'assessment_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assessment" />
    ),
    cell: ({ row }) => <div className="max-w-[210px]">{row.getValue('assessment_name')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" className='sm:table-header-group hidden' />
    ),
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate font-medium sm:table-row-group hidden">
        {row.getValue('type')}
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowValue: string = row.getValue(id);
      return value.some((letter: string) =>
        rowValue.toLowerCase().startsWith(letter.toLowerCase())
      );
    },
  },
  {
    accessorKey: 'weighting',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Weighting" />
    ),
    cell: ({ row }) => (
      <div className="w-[50px] truncate font-medium">
        {row.getValue('weighting')}
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowValue: string = row.getValue(id);
      return value.some((letter: string) =>
        rowValue.toLowerCase().startsWith(letter.toLowerCase())
      );
    },
  },
  {
    accessorKey: 'length',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Length" className='md:table-header-group hidden' />
    ),
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate font-medium md:table-row-group hidden">
        {!row.getValue('length') ? "N/A" : row.getValue('length')}
      </div>
    ),
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[250px] font-medium">
        {row.getValue('due_date')}
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowValue: string = row.getValue(id);
      return value.some((letter: string) =>
        rowValue.toLowerCase().startsWith(letter.toLowerCase())
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
