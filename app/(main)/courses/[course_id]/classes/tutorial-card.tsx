import { Suspense } from "react";
import Link from "next/link";

import { ArrowRightIcon } from "@radix-ui/react-icons";

import { ISOTimeToLocalTime } from "@/lib/datetime";
import { Button } from "@/components/ui/button";

interface TutorialCardProps {
  id: string;
  name: string;
  day: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  member_count: number;
}

export function TutorialCard({
  id,
  name,
  day,
  start_time,
  end_time,
  location,
  capacity,
  member_count,
}: TutorialCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-background shadow-lg">
      <img
        src={`https://picsum.photos/seed/${id}/400/120?blur=5`}
        width={400}
        height={120}
        alt="Course Image"
        className="w-full object-cover"
      />
      <div className="p-4">
        <h3 className="mb-2 flex items-baseline gap-x-3 text-lg font-semibold">
          {name}
          <span className="text-sm font-normal text-muted-foreground">
            @{location}
          </span>
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {member_count}/{capacity} students
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          <b>{day}</b> {ISOTimeToLocalTime(start_time)}-
          {ISOTimeToLocalTime(end_time)}
        </p>
        <Button
          variant="outline"
          Icon={ArrowRightIcon}
          iconPlacement="left"
          size="sm"
          asChild
        >
          <Link href={`/tutorials/${id}`} prefetch={false}>
            View
          </Link>
        </Button>
      </div>
    </div>
  );
}
