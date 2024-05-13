import {
  AlertCircle,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
} from "lucide-react";

import {
  MdSignalCellularAlt,
  MdSignalCellularAlt1Bar,
  MdSignalCellularAlt2Bar,
} from "react-icons/md";

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
    // icon: PiCellSignalFullFill,
    icon: MdSignalCellularAlt,
  },
  {
    value: "medium",
    label: "Medium",
    // icon: PiCellSignalMediumFill,
    icon: MdSignalCellularAlt2Bar,
  },
  {
    value: "low",
    label: "Low",
    // icon: PiCellSignalLowFill,
    icon: MdSignalCellularAlt1Bar,
  },
];
