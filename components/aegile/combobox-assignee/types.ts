import { Signal } from '@preact/signals-react';

export type SelectAssignee = {
  value: string;
  label: string;
  icon: string;
};

export type SelectAssigneeProps = {
  selectedAssignee: Signal<SelectAssignee>;
};
