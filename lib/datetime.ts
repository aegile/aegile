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
  return format(date, "EEEE, do MMMM yyyy, h:mm a");
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

export function ISOTimeToLocalTime(time: string, is12Hour: boolean = true) {
  const date = new Date();
  const [hours, minutes, ...rem] = time.split(":");
  date.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

  // Get local hours and minutes
  const localHours = date.getHours().toString().padStart(2, "0");
  const localMinutes = date.getMinutes().toString().padStart(2, "0");

  // Convert to 12-hour format
  if (is12Hour) {
    const suffix = parseInt(localHours) >= 12 ? "PM" : "AM";
    const hours12 = parseInt(localHours) % 12 || 12;
    return `${hours12}:${localMinutes} ${suffix}`;
  }
  return `${localHours}:${localMinutes}`;
}
