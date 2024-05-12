import {
  AlertCircle,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
} from "lucide-react";

import {
  PiCellSignalNoneFill,
  PiCellSignalLowFill,
  PiCellSignalMediumFill,
  PiCellSignalFullFill,
  PiWarningCircleFill,
} from "react-icons/pi";
import { AiOutlineDash } from "react-icons/ai";

import { LuAlertCircle } from "react-icons/lu";

import { SelectPriority } from "./types";

export const priorities: SelectPriority[] = [
  {
    value: "urgent",
    label: "Urgent",
    icon: PiWarningCircleFill,
  },
  {
    value: "high",
    label: "High",
    icon: PiCellSignalFullFill,
  },
  {
    value: "medium",
    label: "Medium",
    icon: PiCellSignalMediumFill,
  },
  {
    value: "low",
    label: "Low",
    icon: PiCellSignalLowFill,
  },
];
