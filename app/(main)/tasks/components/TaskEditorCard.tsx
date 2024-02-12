import React from 'react';

import {
  CaretSortIcon,
  ChatBubbleIcon,
  CheckIcon,
  CounterClockwiseClockIcon,
  InfoCircledIcon,
  MinusIcon,
} from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Task } from '@/lib/types';
import { SortableTaskCard } from './SortableTaskCard';
import TaskAssignCombobox from './TaskAssignCombobox';
import { TaskEditorContext } from '../contexts/TaskEditorContext';

type TaskCardProps = Task & {
  index: number;
  isSubtask?: boolean;
  isCollapsed?: boolean;
  parentIndex?: number;
};

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const tooltips = [
  { icon: <InfoCircledIcon />, value: 'Task Info' },
  { icon: <ChatBubbleIcon />, value: 'Open Chat' },
  { icon: <CounterClockwiseClockIcon />, value: 'Open History' },
  { icon: <CheckIcon />, value: 'Mark as Complete' },
];

export default function TaskEditorCard({
  id,
  index,
  name,
  children,
  parentIndex = -1,
  isSubtask = false,
  isCollapsed = true,
}: TaskCardProps) {
  const [isOpen, setIsOpen] = React.useState(isCollapsed);
  const isChildless = children.length <= 0;
  const { tasks: rootTasks, setTasks } = React.useContext(TaskEditorContext);

  function unassignFromParentTask(parentIndex: number, childIndex: number) {
    setTasks((tasks) => {
      const newItems = [...tasks];
      const childItem = newItems[parentIndex].children[childIndex];
      newItems[parentIndex].children.splice(childIndex, 1);
      newItems.push(childItem);
      return newItems;
    });
  }

  return (
    <Collapsible
      open={isOpen && !isCollapsed}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 break-inside-avoid"
    >
      <Card
        key={id}
        className={`max-w-[750px] w-full break-inside-avoid focus-within:shadow-lg focus-within:shadow-primary/50 transition-shadow duration-500 border-l-4 ${
          isSubtask ? 'border-l-[#dddfff]' : 'border-l-[#adb2ff]'
        }`}
      >
        <TooltipProvider>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="truncate spacing-x-2">
                {isSubtask && '↪ '} {name}
              </div>
              {!isChildless && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <CaretSortIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              )}
            </CardTitle>
            <CardDescription className="flex">
              {isSubtask && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 mr-1 aspect-square p-1"
                      onClick={() => {
                        if (parentIndex < 0) {
                          return;
                        }
                        unassignFromParentTask(parentIndex, index);
                      }}
                    >
                      <MinusIcon className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unassign as subtask</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {isChildless && (
                <TaskAssignCombobox
                  parentIndex={parentIndex}
                  currIndex={index}
                />
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 break-inside-avoid cursor-text">
            <Editor />
          </CardContent>
          <CardFooter className="flex space-x-2 break-inside-avoid p-2 pt-0">
            {tooltips.map((tooltip, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted h-8 w-8"
                  >
                    {tooltip.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip.value}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </CardFooter>
        </TooltipProvider>
      </Card>
      <CollapsibleContent className="pl-8">
        <div className="space-y-2">
          {children.map((subtask, subtaskIndex) => {
            return (
              <SortableTaskCard
                key={subtask.id}
                id={subtask.id}
                name={subtask.name}
                index={subtaskIndex}
                children={[]}
                parentIndex={index}
                isSubtask
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
