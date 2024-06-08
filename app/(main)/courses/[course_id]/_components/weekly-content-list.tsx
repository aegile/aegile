import { ComponentProps } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { CircleIcon, StarIcon, Presentation, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { WeeklyContent } from '@/lib/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface WeeklyContentListProps {
  items: WeeklyContent[];
  children?: React.ReactNode;
}

export function WeeklyContentList({
  items,
}: WeeklyContentListProps) {
  return (
    <div className="flex flex-col gap-2">
      {items
        // .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
        .map((wkc, index) => (
          <button
            key={index}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all duration-300 bg-background/80 hover:bg-accent',
            )}
            // onClick={}
          >
            <Image
              alt="Course image"
              className="aspect-square rounded-md object-cover md:inline hidden"
              height="52"
              src="/aegile-logo-only.svg"
              width="52"
            />
            
            <div className="flex w-full flex-col gap-1 md:pl-4">
              <div className="line-clamp-1 font-semibold text-lg">{wkc.name}</div>
              <div className="flex items-center gap-6">
                <div className="font-medium">
                  Dates: {wkc.dates}
                </div>
                <CircleIcon className="h-2 w-2" />
                <div className="font-medium">
                  Tasks: {wkc.tasks}
                </div>
                <CircleIcon className="h-2 w-2" />
                <div className="font-medium">
                  {"Status: "}
                  { wkc.status === 100 ? "Completed" : 
                    `${wkc.status}% of Students Completed`}
                </div>

              </div>
            </div>

            <ChevronRight className="h-25 w-25"/>
          </button>
        ))}
    </div>
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
