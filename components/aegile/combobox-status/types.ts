import { LucideIcon } from "lucide-react";
import { Signal } from "@preact/signals-react";

export type SelectStatus = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type SelectStatusProps = {
  selectedStatus: SelectStatus;
  setSelectedStatus: (value: SelectStatus) => void;
  isIcon?: boolean;
  btnVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};
