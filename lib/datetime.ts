"use client";

import { format, formatRelative } from "date-fns";
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

export function formatDatetimeRelative(date: Date) {
  return formatRelative(date, new Date(), { locale });
}
export function formatDatetimeFormal(date: Date) {
  return format(date, "do MMM yyyy, h:m b");
  return formatRelative(date, new Date(), { locale });
}
// Compare this snippet from node_modules/date-fns/locale/en-AU/_lib/formatRelative/index.js:
