'use client';

import { MapPin } from 'lucide-react';
import Link from 'next/link';

const dayMapping = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const today = new Date().getDay();
const todayEnum = today === 0 ? 7 : today;

export default function TimelineExcerpt({
  classCode,
  times,
  day,
  location,
}: {
  classCode: string;
  times: string;
  day: Day;
  location: string;
}) {
  const tutDayEnum = dayMapping[day];
  const currTime = new Date().toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
  });
  const [startTime, endTime] = times.split(' - ');
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center justify-center mr-4">
        <div className="w-px h-[30px] bg-gray-300" />
        <div
          className={`rounded-full w-[15px] h-[15px] border border-gray-500 ${
            todayEnum > tutDayEnum ||
            (todayEnum === tutDayEnum && currTime.localeCompare(endTime) > 0)
              ? 'bg-gray-200'
              : todayEnum === tutDayEnum &&
                currTime.localeCompare(startTime) > 0
              ? 'bg-primary'
              : ''
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
          {day} {startTime} - {endTime}
        </p>
      </div>
    </div>
  );
}
