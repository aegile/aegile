import {
  AlertCircle,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
} from 'lucide-react';

import {
  PiCellSignalNoneDuotone,
  PiCellSignalLowDuotone,
  PiCellSignalMediumDuotone,
  PiCellSignalFullDuotone,
  PiWarningCircleDuotone,
} from 'react-icons/pi';

import { LuAlertCircle } from 'react-icons/lu';

import { SelectPriority } from './types';

export const priorities: SelectPriority[] = [
  {
    value: 'none',
    label: 'None',
    icon: PiCellSignalNoneDuotone,
  },
  {
    value: 'urgent',
    label: 'Urgent',
    icon: PiWarningCircleDuotone,
  },
  {
    value: 'high',
    label: 'High',
    icon: PiCellSignalFullDuotone,
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: PiCellSignalMediumDuotone,
  },
  {
    value: 'low',
    label: 'Low',
    icon: PiCellSignalLowDuotone,
  },
];
