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

interface CourseCardProps {
  id: string;
  term: string;
  code: string;
  name: string;
  deliverables: number;
}

function CourseGridCard({
  id,
  term,
  code,
  name,
  deliverables,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="h-full flex flex-col">
        <Image
          src="https://unsplash.it/250/125"
          width={250}
          height={125}
          alt="Test"
          className="rounded-t-xl w-full h-auto object-cover"
        />
        <CardHeader className="pb-3">
          <CardTitle>
            {term}-{code}
          </CardTitle>
          <CardDescription>{name}</CardDescription>
        </CardHeader>
        <TooltipProvider>
          <CardContent className="mt-auto flex space-x-3">
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
          </CardContent>
        </TooltipProvider>
      </Card>
    </Link>
  );
}

export default CourseGridCard;
