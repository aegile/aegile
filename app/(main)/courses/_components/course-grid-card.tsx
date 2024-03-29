import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import Link from 'next/link';

import { User, BookCheck } from 'lucide-react';
import IconTextTooltip from '@/components/icon-text-tooltip';
import { Course } from '@/lib/types';

function CourseGridCard({ item }: { item: Course }) {
  const { id, term, code, name, member_count } = item;

  return (
    <Link href={`/courses/${id}`}>
      <Card className="h-full flex flex-col hover:bg-accent hover:text-accent-foreground">
        <Image
          src="https://unsplash.it/250/100"
          width={250}
          height={100}
          alt="Test"
          className="rounded-t-xl w-full object-cover"
        />
        <CardHeader className="pb-0">
          <CardTitle>
            {term}-{code}
          </CardTitle>
          <CardDescription>{name}</CardDescription>
        </CardHeader>
        <TooltipProvider>
          <CardContent className="mt-auto">
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
                  tooltip: '2 deliverables',
                },
              ]}
            />
          </CardContent>
        </TooltipProvider>
      </Card>
    </Link>
  );
}

export default CourseGridCard;
