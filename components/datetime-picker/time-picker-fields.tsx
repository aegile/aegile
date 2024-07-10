"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";

import { MeridiemSelect } from "./meridiem-select";
import { TimePickerInput } from "./time-picker-input";
import { Meridiem } from "./time-picker-utils";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePickerFields({ date, setDate }: TimePickerDemoProps) {
  const [meridiem, setMeridiem] = React.useState<Meridiem>(
    date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM",
  );

  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);
  const meridiemRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          hrs
        </Label>
        <TimePickerInput
          picker="12hours"
          meridiem={meridiem}
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          min
        </Label>
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      {/* <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <TimePickerInput
          picker="seconds"
          id="seconds12"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
          onRightFocus={() => meridiemRef.current?.focus()}
        />
      </div> */}
      <div className="grid gap-1 text-center">
        {/* <Label htmlFor="meridiem" className="text-xs">
          Meridiem
        </Label> */}
        <MeridiemSelect
          meridiem={meridiem}
          setMeridiem={setMeridiem}
          date={date}
          setDate={setDate}
          ref={meridiemRef}
          onLeftFocus={() => secondRef.current?.focus()}
        />
      </div>
    </div>
  );
}
