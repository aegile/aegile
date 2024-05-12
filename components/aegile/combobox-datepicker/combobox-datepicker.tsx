"use client";

import * as React from "react";
import { CalendarIcon, CalendarX2Icon } from "lucide-react";
import { addDays, format, isWithinInterval, isPast, isSameDay } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ComboboxDatepicker() {
  const today = new Date();
  const [date, setDate] = React.useState<Date>();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 justify-start bg-transparent px-2 text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {date && isPast(date) ? (
            isSameDay(date, today) ? (
              <CalendarIcon className="mr-1 h-4 w-4 text-red-400" />
            ) : (
              <CalendarX2Icon className="mr-1 h-4 w-4 text-red-400" />
            )
          ) : date &&
            isWithinInterval(date, {
              start: today,
              end: addDays(today, 7),
            }) ? (
            <CalendarIcon className="mr-1 h-4 w-4 text-amber-500" />
          ) : (
            <CalendarIcon className="mr-1 h-4 w-4" />
          )}

          {date ? format(date, "MMM d") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
