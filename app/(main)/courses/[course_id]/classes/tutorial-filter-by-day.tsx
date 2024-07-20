"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";

export default function TutorialFilterByDay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);
  //     return params.toString();
  //   },
  //   [searchParams],
  // );

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleCheckboxChange = (day: string, isChecked: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedDays = params.get("days")?.split(",") || [];

    let newSelectedDays = isChecked
      ? [...selectedDays, day]
      : selectedDays.filter((d) => d !== day);

    if ((isChecked && day === "All") || newSelectedDays.length === 5) {
      newSelectedDays = ["All"]; // If all days are selected, just use "All"
    } else if (newSelectedDays.includes("All") && day !== "All") {
      newSelectedDays = days.filter((listDay) => listDay !== day); // If all days are selected, just use "All"
    }

    if (newSelectedDays.length) {
      params.set("days", newSelectedDays.join(","));
    } else {
      params.delete("days");
    }

    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const selectedDays = searchParams.get("days")?.split(",") || [];
  return (
    <div className="top-24 self-start rounded-lg bg-muted p-4 md:sticky md:p-6">
      <h3 className="mb-4 text-lg font-semibold">Filter by Day</h3>
      <div className="space-y-4">
        <div className="flex cursor-pointer items-center space-x-2">
          <Checkbox
            id={`filter-day-all`}
            checked={selectedDays.includes("All")}
            onCheckedChange={(e) => {
              handleCheckboxChange("All", e);
              return;
            }}
          />
          <label
            htmlFor={`filter-day-all`}
            className="cursor-pointer text-sm font-medium leading-none text-muted-foreground transition-colors hover:text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            All days
          </label>
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="ml-3 flex cursor-pointer items-center space-x-2"
          >
            <Checkbox
              id={`filter-day-${day.toLowerCase()}`}
              checked={
                selectedDays.includes(day) || selectedDays.includes("All")
              }
              onCheckedChange={(e) => {
                handleCheckboxChange(day, e);
                return;
              }}
            />
            <label
              htmlFor={`filter-day-${day.toLowerCase()}`}
              className="cursor-pointer text-sm font-medium leading-none text-muted-foreground transition-colors hover:text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {day}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
