"use client";

import { ComponentProps } from "react";
import Link from "next/link";

import { formatDistanceToNow } from "date-fns";

import { formatDatetimeDistance, formatDatetimeFormal } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Assignment = {
  id: string;
  name: string;
  weighting: number;
  variant: string;
  description: string;
  deadline: string;
  labels: string[];
  archived: boolean;
};

interface ProjectsInboxListProps {
  items: Assignment[];
  selected: string | null;
  setSelected: (id: string) => void;
}

export function ProjectsInboxList({
  items,
  selected,
  setSelected,
}: ProjectsInboxListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-15.5rem)]">
      <div className="flex flex-col gap-2 py-2 pl-1 pr-4">
        {items.map((item) => (
          <Link
            id={item.id}
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border bg-background/80 p-3 text-left text-sm transition-all duration-300 hover:bg-accent",
              selected === item.id && "border-primary/30 bg-accent",
            )}
            href={`?ass=${item.id}`}
            // onClick={() => setSelected(item.id)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                  suppressHydrationWarning
                >
                  Due: {formatDatetimeFormal(new Date(item.deadline))}
                </div>
              </div>
              <div className="text-xs font-medium">{item.variant}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              nesciunt incidunt perspiciatis suscipit? Adipisci officia
              praesentium pariatur fugit, autem deserunt explicabo similique
              tenetur ut aliquam repellendus magni temporibus id. Ut.
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string,
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
