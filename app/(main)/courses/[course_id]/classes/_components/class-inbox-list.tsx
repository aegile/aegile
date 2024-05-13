import { ComponentProps } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { CircleIcon, StarIcon, Presentation } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tutorial } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassInboxListProps {
  items: Tutorial[];
  selected: string;
  setSelected: (id: string) => void;
  children?: React.ReactNode;
}

export function ClassInboxList({
  items,
  selected,
  setSelected,
}: ClassInboxListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-15.5rem)]">
      <div className="flex flex-col gap-2 py-2 pl-1 pr-4">
        {items
          // .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
          .map((tut, index) => (
            <button
              key={index}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border bg-background/80 p-3 text-left text-sm transition-all duration-300 hover:bg-accent",
                selected === tut.id && "border-primary/30 bg-accent",
              )}
              onClick={() => setSelected(tut.id)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{tut.name}</div>
                  </div>
                  <div className="ml-auto text-xs">
                    {formatDistanceToNow(tut.datetime, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="font-light">
                  {format(tut.datetime, "EEEE haaa")}, @ {tut.location}
                </div>
              </div>
              <div className="line-clamp-2 flex space-x-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                  TypeScript
                </div>
                <div className="flex items-center">
                  <StarIcon className="mr-1 h-3 w-3" />
                  20k
                </div>
                <div>Updated April 2023</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Hayden Smith</Badge>
                <Badge variant="secondary">Joanna Lee</Badge>
              </div>
            </button>
          ))}
      </div>
    </ScrollArea>
  );
}

// function getBadgeVariantFromLabel(
//   label: string
// ): ComponentProps<typeof Badge>['variant'] {
//   if (['work'].includes(label.toLowerCase())) {
//     return 'default';
//   }

//   if (['personal'].includes(label.toLowerCase())) {
//     return 'outline';
//   }

//   return 'secondary';
// }
