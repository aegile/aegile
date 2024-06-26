"use client";

import { format, formatDistanceToNow, formatRelative } from "date-fns";
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
