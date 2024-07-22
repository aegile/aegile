"use client";

import * as React from "react";

import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hot-keys";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Kbd } from "../kbd";
import { CancelledIcon, DoneIcon, InProgressIcon, InReviewIcon } from "./icons";
import { CheckIcon } from "./icons/check";

type Status = {
  value: (typeof statuses)[number]["value"];
  label: string;
  icon: any;
  color?: string;
};

const statuses = [
  { value: "backlog", label: "Backlog", icon: CircleDashedIcon },
  { value: "todo", label: "Todo", icon: CircleIcon },
  {
    value: "in_progress",
    label: "In Progress",
    icon: InProgressIcon,
  },
  {
    value: "in_review",
    label: "In Review",
    icon: InReviewIcon,
  },
  { value: "done", label: "Done", icon: DoneIcon },
  { value: "cancelled", label: "Cancelled", icon: CancelledIcon },
] as const;

export const StatusCombobox = ({
  isActive,
  isTask = false,
  isIcon = false,
}: {
  isActive: boolean;
  isTask?: boolean;
  isIcon?: boolean;
}) => {
  const [openPopover, setOpenPopover] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>({
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  });

  const [searchValue, setSearchValue] = React.useState("");

  const isSearching = searchValue.length > 0;

  useHotkeys(
    [
      [
        "s",
        () => {
          setOpenTooltip(false);
          setOpenPopover(true);
        },
      ],
    ],
    isActive,
  );

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <Tooltip
        delayDuration={500}
        open={openTooltip}
        onOpenChange={setOpenTooltip}
      >
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              aria-label="Set status"
              variant={isTask ? "ghost" : "outline"}
              size="sm"
              className={cn(
                "h-6 w-fit px-2 text-xs font-normal leading-normal text-primary dark:border-[#383b41] dark:bg-[#292c33]",
                isIcon && "m-0 h-[22px] w-[22px] p-[3px]",
                isTask && "p-2 dark:bg-transparent",
              )}
            >
              {selectedStatus && (
                <>
                  <selectedStatus.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      // selectedStatus.value !== "urgent" && "fill-primary",
                      isIcon && "mr-1 px-0",
                      selectedStatus?.color && `fill-${selectedStatus.color}`,
                    )}
                    aria-hidden="true"
                  />
                  {!isIcon && selectedStatus.label}
                </>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent
          hideWhenDetached
          // side="bottom"
          // align="start"
          // sideOffset={6}
          className="flex h-8 items-center gap-2 px-2 text-xs"
        >
          <span>Change status</span>
          <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-[206px] rounded-lg p-0"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={6}
      >
        <Command className="rounded-lg">
          <CommandInput
            value={searchValue}
            onValueChange={(searchValue) => {
              // If the user types a number, select the status like useHotkeys
              if ([1, 2, 3, 4, 5, 6].includes(Number.parseInt(searchValue))) {
                setSelectedStatus(statuses[Number.parseInt(searchValue) - 1]);
                setOpenTooltip(false);
                setOpenPopover(false);
                setSearchValue("");
                return;
              }
              setSearchValue(searchValue);
            }}
            className="text-[0.8125rem] leading-normal"
            placeholder="Set status..."
          >
            {!isSearching && <Kbd>S</Kbd>}
          </CommandInput>
          <CommandList>
            <CommandGroup>
              {statuses.map((status, index) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(value) => {
                    setSelectedStatus(
                      statuses.find((p) => p.value === value) || null,
                    );
                    setOpenTooltip(false);
                    setOpenPopover(false);
                    setSearchValue("");
                  }}
                  className="group flex w-full items-center justify-between rounded-md text-[0.8125rem] leading-normal text-primary"
                >
                  <div className="flex items-center">
                    {/* <status.icon className="mr-2 h-4 w-4 fill-muted-foreground group-hover:fill-primary" /> */}
                    <status.icon className="mr-2 h-4 w-4" />
                    <span>{status.label}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedStatus?.value === status.value && (
                      <CheckIcon
                        title="Check"
                        className="size-4 mr-3 fill-muted-foreground group-hover:fill-primary"
                      />
                    )}
                    {!isSearching && (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
