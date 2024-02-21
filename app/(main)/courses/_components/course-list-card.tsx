import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import {
  User,
  ScrollText,
  BookCheck,
  GraduationCap,
  CalendarX,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import IconTextTooltip from '@/components/icon-text-tooltip';
import { Course } from '@/lib/types';

function CourseListCard({ item }: { item: Course }) {
  const {
    id,
    term,
    code,
    name,
    member_count,
    labels = ['computer science'],
  } = item;
  return (
    <Link href={`/courses/${id}`}>
      <Card className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground">
        <CardHeader className="pr-2">
          <CardTitle>
            {term}-{code}
          </CardTitle>
          <CardDescription className="line-clamp-1">{name}</CardDescription>
          {labels.length ? (
            <div className="flex items-center gap-2 mt-auto">
              {labels.map((label) => (
                <Badge key={label} variant="outline">
                  <p className="whitespace-nowrap">{label}</p>
                </Badge>
              ))}
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="lg:block hidden text-sm py-5 px-2 space-y-1">
          <TooltipProvider>
            <IconTextTooltip
              tooltips={[
                {
                  icon: ScrollText,
                  marginRight: 2,
                  text: 'Capstone Project',
                  tooltip: 'Upcoming Assignment',
                },
                {
                  icon: CalendarX,
                  marginRight: 2,
                  text: 'Thu 15th Apr, 2024 (11:59 PM)',
                  tooltip: 'Upcoming Assignment Deadline',
                },
              ]}
            />
            <IconTextTooltip
              isFlex
              tooltips={[
                {
                  icon: User,
                  marginRight: 1,
                  text: member_count.toString(),
                  tooltip: `${member_count} members`,
                },
                {
                  icon: BookCheck,
                  marginRight: 1,
                  text: '2',
                  tooltip: '2 deliberables',
                },
              ]}
            />
          </TooltipProvider>
        </CardContent>
        <div className="relative block w-full h-full">
          <Image
            src="https://unsplash.it/250/125"
            alt="Test"
            fill
            className="ml-auto xl:block hidden rounded-r-xl object-cover"
          />
        </div>
      </Card>
    </Link>
  );
}

export default CourseListCard;
