import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { UniqueIdentifier } from "@dnd-kit/core";
import { DotsHorizontalIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { LucideIcon, PlusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskCreationDialog } from "@/components/aegile/task-creation-dialog";

interface ContainerProps {
  id: UniqueIdentifier;
  children?: React.ReactNode;
  title?: string;
  status?: { icon: LucideIcon; color?: string };
  onAddItem?: () => void;
  isOverlay?: boolean;
}

const Container = ({
  id,
  children,
  title,
  status,
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
      type: "container",
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
          "bg-gradient-to-b from-[#f5f5f5] to-[#fbfbfb] dark:from-[#0c0d0d] dark:to-[#151515]",
        "flex w-72 cursor-default flex-col gap-y-4 rounded-lg py-3 pl-3 sm:w-[340px]",
        children ? "h-full" : "h-full",
        isDragging && "border border-primary opacity-50",
      )}
    >
      <TooltipProvider>
        <div
          className={clsx(
            "mb-3 flex items-center justify-between rounded-md",
            isOverlay && "border border-gray-50 p-4",
          )}
        >
          <div className="flex items-center gap-y-1">
            {/* <DragHandleDots2Icon
              className="h-5 w-5 cursor-grab text-muted"
              {...listeners}
            /> */}
            {status && <status.icon className="mr-2 h-4 w-4" {...listeners} />}
            <h1 className="truncate text-sm font-semibold">{title}</h1>
          </div>
          <div className="flex gap-x-2 pr-3">
            <Tooltip>
              <TooltipTrigger>
                <TaskCreationDialog>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-1"
                    // onClick={onAddItem}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </TaskCreationDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Item</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-1"
                >
                  <DotsHorizontalIcon className="h-4 w-4" />
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
