"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  display12HourValue,
  Meridiem,
  setDateByType,
} from "./time-picker-utils";

export interface MeridiemSelectorProps {
  meridiem: Meridiem;
  setMeridiem: (m: Meridiem) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

export const MeridiemSelect = React.forwardRef<
  HTMLButtonElement,
  MeridiemSelectorProps
>(
  (
    { meridiem, setMeridiem, date, setDate, onLeftFocus, onRightFocus },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
    };

    const handleValueChange = (value: Meridiem) => {
      setMeridiem(value);

      /**
       * trigger an update whenever the user switches between AM and PM;
       * otherwise user must manually change the hour each time
       */
      if (date) {
        const tempDate = new Date(date);
        const hours = display12HourValue(date.getHours());
        setDate(
          setDateByType(
            tempDate,
            hours.toString(),
            "12hours",
            meridiem === "AM" ? "PM" : "AM",
          ),
        );
      }
    };

    return (
      <div className="flex items-center">
        <Select
          defaultValue={meridiem}
          onValueChange={(value: Meridiem) => handleValueChange(value)}
        >
          <SelectTrigger
            ref={ref}
            className="w-[65px] focus:bg-accent focus:text-accent-foreground"
            onKeyDown={handleKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
);

MeridiemSelect.displayName = "MeridiemSelect";
