import {
  CheckCircle,
  Circle,
  CircleDashed,
  CircleDot,
  XCircle,
} from 'lucide-react';

import { SelectStatus } from './types';

export const statuses: SelectStatus[] = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: CircleDashed,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: CircleDot,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: XCircle,
  },
];
