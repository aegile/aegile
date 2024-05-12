import { Signal } from "@preact/signals-react";

export type SelectAssignee = {
  value: string;
  label: string;
  icon: string;
};

export type SelectAssigneeProps = {
  selectedAssignee: SelectAssignee | null;
  setSelectedAssignee: (value: SelectAssignee | null) => void;
  isIcon?: boolean;
};
