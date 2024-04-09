import { LucideIcon } from 'lucide-react';
import { Signal } from '@preact/signals-react';

export type SelectStatus = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type SelectStatusProps = {
  selectedStatus: Signal<SelectStatus>;
};
