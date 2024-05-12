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

import { User, ListTodo } from 'lucide-react';
import IconTextTooltip from '@/components/icon-text-tooltip';
import { Task } from '@/lib/types';

function TaskCard({ item }: { item: Task }) {
  const { id, project_id, name, description, deadline, weighting, priority, member_count } = item;

  return (
    <Link href={`/tasks/${id}`}>
      <Card className="w-[225px] h-[150px] flex flex-col hover:bg-accent hover:text-accent-foreground">
        <CardHeader className="p-4 pb-0">
          <CardTitle>
            {name}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex flex-col">
            
            <div className="w-fit rounded bg-slate-100 border px-1 py-0.5">
              <p className="text-xs text-muted-foreground">{deadline}</p>
            
            </div>
            {/* <small>{priority}</small>
            <small>{weighting}</small> */}

            <TooltipProvider>
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
                    icon: ListTodo,
                    marginRight: 1,
                    text: '2',
                    tooltip: '2 subtasks',
                  },
                ]}
              />
            </TooltipProvider>

          </div>

        </CardContent>
        
      </Card>
    </Link>
  );
}

export { TaskCard };