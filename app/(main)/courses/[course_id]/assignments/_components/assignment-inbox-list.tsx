import { ComponentProps } from "react";
import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Assignment } from "../data";

interface AssignmentInboxListProps {
  items: Assignment[];
  selected: string;
  setSelected: (id: string) => void;
}

export function AssignmentInboxList({
  items,
  selected,
  setSelected,
}: AssignmentInboxListProps) {
  return (
    <div className="flex w-full flex-col gap-2 py-2">
      {items.map((item) => (
        <button
          key={item.id}
          className={cn(
            "flex w-full flex-col items-start gap-2 rounded-lg border bg-background/80 p-3 text-left text-sm transition-all duration-300 hover:shadow-md",
            selected === item.id && "border-primary/30 shadow-md",
          )}
          onClick={() => setSelected(item.id)}
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
              >
                {formatDistanceToNow(new Date(item.deadline), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div className="text-xs font-medium">{item.variant}</div>
          </div>
          <div className="line-clamp-2 text-xs text-muted-foreground">
            {item.description.substring(0, 300)}
          </div>
          <div className="flex w-full flex-nowrap items-center justify-between">
            {item.labels.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link href={`/assignments/${item.id}`}>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </button>
      ))}
    </div>
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
