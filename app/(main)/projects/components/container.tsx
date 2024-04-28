import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { UniqueIdentifier } from '@dnd-kit/core';
import { DotsHorizontalIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import { PlusIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ContainerProps {
  id: UniqueIdentifier;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
  isOverlay?: boolean;
}

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
  isOverlay = false,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        !isOverlay &&
          'bg-gradient-to-b from-[#f5f5f5] to-[#fbfbfb] dark:from-[#0c0d0d] dark:to-[#151515]',
        'min-w-[250px] max-w-[250px] sm:min-w-[350px] sm:max-w-[350px] p-4 h-full rounded-xl flex flex-col gap-y-4 cursor-default',
        isDragging && 'opacity-50 border border-primary'
      )}
    >
      <TooltipProvider>
        <div
          className={clsx(
            'flex justify-between items-center mb-3 rounded-xl',
            isOverlay && 'p-4 border border-gray-50'
          )}
        >
          <div className="flex items-center gap-y-1">
            <DragHandleDots2Icon
              className="w-5 h-5 cursor-grab"
              {...listeners}
            />
            <h1 className="font-semibold truncate">{title}</h1>
          </div>
          <div className="flex gap-x-2">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onAddItem}
                >
                  <PlusIcon className="w-5 h-5 text-muted" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Item</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <DotsHorizontalIcon className="w-5 h-5 text-muted" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>List options</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {children}
      </TooltipProvider>
    </div>
  );
};

export default Container;
