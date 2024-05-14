import { addDays, addHours, format, nextSaturday } from "date-fns";

import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
  ClipboardListIcon,
  PlusIcon,
  Edit2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { DeliverableCreationForm } from "./deliverable-creation-form";

interface AssignmentActionBarProps {
  assignmentId: string;
  disabled?: boolean;
}

export function ProjectsActionBar({
  assignmentId,
  disabled = false,
}: AssignmentActionBarProps) {
  const today = new Date();
  return (
    <div className="flex items-center p-2">
      <div className="px-3 font-semibold">Tutorial Assignment Groups</div>
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <Dialog>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={disabled}>
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add Deliverable</span>
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <DialogContent className="max-h-[70%] min-w-fit">
              <DialogHeader>
                <DialogTitle>Add Deliverable</DialogTitle>
                <DialogDescription>
                  Create a new deliverable for this assignment.
                </DialogDescription>
              </DialogHeader>

              {/* <DeliverableCreationForm assignmentId={assignmentId} /> */}
              {/* <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                                </DialogClose>
                            </DialogFooter> */}
            </DialogContent>
          </Dialog>
          <TooltipContent>New Project</TooltipContent>
        </Tooltip>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" disabled={disabled}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Move to trash</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Move to trash</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={disabled}>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
          <DropdownMenuItem>Star thread</DropdownMenuItem>
          <DropdownMenuItem>Add label</DropdownMenuItem>
          <DropdownMenuItem>Mute thread</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
