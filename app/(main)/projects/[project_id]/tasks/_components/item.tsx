import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { CircleIcon, LucideIcon } from "lucide-react";
import {
  ComboboxPriority,
  SelectPriority,
} from "@/components/aegile/combobox-priority";
import { PiCellSignalNoneFill } from "react-icons/pi";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ComboboxAssignee,
  SelectAssignee,
} from "@/components/aegile/combobox-assignee";
import {
  ComboboxStatus,
  SelectStatus,
} from "@/components/aegile/combobox-status";
import { ComboboxDatepicker } from "@/components/aegile/combobox-datepicker/combobox-datepicker";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  status: SelectStatus;
};

const Items = ({ id, title, status }: ItemsType) => {
  const [selectedPriority, setSelectedPriority] =
    React.useState<SelectPriority | null>(null);
  const [selectedAssignee, setSelectedAssignee] =
    React.useState<SelectAssignee | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState(status);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full cursor-pointer rounded-md border  bg-white px-3 py-3 dark:bg-[#1a1c1e]",
        isDragging
          ? "border-primary opacity-50"
          : "hover:bg-[#fbfbfb] hover:dark:bg-[#272727]",
      )}
    >
      <TooltipProvider>
        <div
          {...listeners}
          className="mb-2 flex items-center text-xs text-muted-foreground hover:cursor-grab"
        >
          {id.toString().toUpperCase()}
          <div className="mx-3 h-1 flex-1 rounded-md bg-gray-50 dark:bg-gray-800" />
        </div>
        <div className="flex items-start text-sm">
          {/* {status && <status.icon className="mr-2 h-6 w-6" />} */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ComboboxStatus
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  btnVariant="ghost"
                  isIcon
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change status</p>
            </TooltipContent>
          </Tooltip>
          <p className="mt-0.5 line-clamp-2">{title}</p>
          {/* <DragHandleDots2Icon
          className="w-4 h-4 text-muted cursor-grab"
        /> */}
        </div>
        <div className="mt-2 flex gap-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ComboboxPriority
                  selectedPriority={selectedPriority}
                  setSelectedPriority={setSelectedPriority}
                  isIcon
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change priority</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ComboboxAssignee
                  selectedAssignee={selectedAssignee}
                  setSelectedAssignee={setSelectedAssignee}
                  isIcon
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change Assignee</p>
            </TooltipContent>
          </Tooltip>
          <ComboboxDatepicker />
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Items;
