"use client";

import {
  format,
  formatDistanceToNow,
  formatRelative,
  setHours,
  setMinutes,
} from "date-fns";
import { enAU } from "date-fns/locale";

const formatRelativeLocale: { [key: string]: string } = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P 'at' p",
};

const locale = {
  ...enAU,
  formatRelative: (token: string | number) => formatRelativeLocale[token],
};

export function formatDatetimeRelative(date: string | Date) {
  return formatRelative(date, new Date(), { locale });
}

export function formatDatetimeFormal(date: string | Date) {
  return format(date, "d MMM yyyy, h:mm a");
  return formatRelative(date, new Date(), { locale });
}

export function formatDatetimeDistance(date: string | Date) {
  return formatDistanceToNow(date, { addSuffix: true });
}
// Compare this snippet from node_modules/date-fns/locale/en-AU/_lib/formatRelative/index.js:

export function convertUTCDateLocalTimeToISO(date: Date, time: string) {
  let localDate = new Date(date); // convert utc to local
  const [hours, minutes] = time.split(":").map(Number);
  localDate = setHours(localDate, hours);
  localDate = setMinutes(localDate, minutes);

  return localDate.toISOString();
}

export function getDateAndTimeFromISO(isoString: string) {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { date, time };
}
