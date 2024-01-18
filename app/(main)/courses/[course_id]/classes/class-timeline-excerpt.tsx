import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function TimelineExcerpt({
  classCode,
  times,
  date,
  location,
}: {
  classCode: string;
  times: string;
  date: string;
  location: string;
}) {
  const dateObj = new Date(date);
  const localeDate = dateObj.toLocaleDateString('en-AU', {
    weekday: 'short',
    // day: 'numeric',
    // month: 'short',
  });
  const relativeTime = dateObj.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center justify-center mr-4">
        <div className="w-px h-[30px] bg-gray-300" />
        <div
          className={`rounded-full w-[15px] h-[15px] border border-gray-500 ${
            new Date() > dateObj && 'bg-gray-200'
          }`}
        />
        <div className="w-px h-[30px] bg-gray-300" />
      </div>
      <div>
        <p className="leading-7 text-sm font-semibold flex items-center whitespace-nowrap">
          {classCode} - {location}
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=UNSW+${location}`}
            target="_blank"
          >
            <MapPin className="ml-2 w-4 h-4 text-gray-400" />
          </Link>
        </p>
        <p className="leading-7 text-sm">
          {localeDate} {relativeTime}
        </p>
      </div>
    </div>
  );
}
