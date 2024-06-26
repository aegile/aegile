import { IconType } from "react-icons";

import { LucideIcon } from "lucide-react";

import { Signal } from "@preact/signals-react";

export type SelectPriority = {
  value: string;
  label: string;
  icon: IconType;
};

export type SelectPriorityProps = {
  selectedPriority: SelectPriority | null;
  setSelectedPriority: (value: SelectPriority | null) => void;
  isIcon?: boolean;
};
