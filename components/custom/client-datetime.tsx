"use client";

import React from "react";

import {
  formatDatetimeDistance,
  formatDatetimeFormal,
  formatDatetimeRelative,
} from "@/lib/datetime";

export function ClientDateTime({
  datetime,
  variant,
}: {
  datetime: string | Date;
  variant?: "relative" | "formal" | "distance";
}) {
  const [localDate, setLocalDate] = React.useState<string | null>(null);
  React.useEffect(() => {
    let result;
    switch (variant) {
      case "relative":
        result = formatDatetimeRelative(datetime);
        break;
      case "formal":
        result = formatDatetimeFormal(datetime);
        break;
      case "distance":
        result = formatDatetimeDistance(datetime);
        break;
      default:
        result = formatDatetimeFormal(datetime);
    }
    setLocalDate(result);
  }, [datetime]);

  return <>{localDate}</>;
}
