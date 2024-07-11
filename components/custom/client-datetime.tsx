"use client";

import React, { useEffect, useState } from "react";

import {
  formatDatetimeDistance,
  formatDatetimeFormal,
  formatDatetimeRelative,
  ISOTimeToLocalTime,
} from "@/lib/datetime";

type Variant = "relative" | "formal" | "distance" | "ISO";

function getFormattedDateTime(
  datetime: string | Date,
  variant?: Variant,
): string {
  switch (variant) {
    case "relative":
      return formatDatetimeRelative(datetime);
    case "formal":
      return formatDatetimeFormal(datetime);
    case "distance":
      return formatDatetimeDistance(datetime);
    case "ISO":
      return ISOTimeToLocalTime(datetime.toString());
    default:
      return formatDatetimeFormal(datetime);
  }
}

export function ClientDateTime({
  datetime,
  variant,
}: {
  datetime: string | Date;
  variant?: Variant;
}) {
  const [localDate, setLocalDate] = useState<string | null>(null);

  useEffect(() => {
    const formattedDate = getFormattedDateTime(datetime, variant);
    setLocalDate(formattedDate);
  }, [datetime, variant]);

  return <>{localDate || "HH:MM"}</>;
}
