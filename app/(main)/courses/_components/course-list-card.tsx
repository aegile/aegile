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

interface CourseCardProps {
  id: string;
  term: string;
  code: string;
  name: string;
  deliverables: number;
  labels?: string[];
}

function CourseListCard({
  id,
  term,
  code,
  name,
  deliverables,
  labels = ['computer science', 'web design'],
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <CardContent className="md:block hidden text-sm py-5 px-2 space-y-1">
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
                  text: 'Thu 15th Apr, 2024',
                  tooltip: 'Next Assignment Deadline',
                },
                {
                  icon: Clock,
                  marginRight: 2,
                  text: '11:59 PM (23:59)',
                  tooltip: 'Deadline Time',
                },
              ]}
            />
          </TooltipProvider>
        </CardContent>
        <div className="py-5 px-2 xl:block hidden text-sm text-muted-foreground">
          <TooltipProvider>
            <IconTextTooltip
              tooltips={[
                {
                  icon: GraduationCap,
                  marginRight: 2,
                  text: 'Dr. William H. Olsen',
                  tooltip: 'Course Convenor',
                },
              ]}
            />
            <IconTextTooltip
              isFlex
              tooltips={[
                {
                  icon: User,
                  marginRight: 1,
                  text: '2',
                  tooltip: '2 Members',
                },
                {
                  icon: BookCheck,
                  marginRight: 1,
                  text: deliverables.toString(),
                  tooltip: `${deliverables} Deliberables`,
                },
              ]}
            />
          </TooltipProvider>
        </div>
        <div className="relative block w-full h-full">
          <Image
            src="https://unsplash.it/250/125"
            alt="Test"
            fill
            className="ml-auto lg:block hidden rounded-r-xl object-cover"
          />
        </div>
      </Card>
    </Link>
  );
}

export default CourseListCard;
