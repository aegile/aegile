'use client';
import * as React from 'react';

import { Paperclip } from 'lucide-react';
import { Signal } from '@preact/signals-react';
import { useSignal } from '@preact/signals-react';

import { TooltipButton } from '@/components/aegile/tooltip-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { Separator } from '../ui/separator';

import {
  ComboboxStatus,
  SelectStatus,
  statuses,
} from '@/components/aegile/combobox-status';
import {
  ComboboxPriority,
  SelectPriority,
  priorities,
} from '@/components/aegile/combobox-priority';
import {
  ComboboxAssignee,
  SelectAssignee,
  assignees,
} from '@/components/aegile/combobox-assignee';
import MultiSelectCombobox from './multiselect-combobox/multiselect-combobox';

export function TaskCreationDialog() {
  const currStatus: Signal<SelectStatus> = useSignal(statuses[1]);
  const currPriority: Signal<SelectPriority> = useSignal(priorities[0]);
  const currAssignee: Signal<SelectAssignee> = useSignal(assignees[0]);
  const currLabels: Signal<SelectStatus[]> = useSignal([]);
  console.log('RERENDED DIALOG');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Task</Button>
      </DialogTrigger>
      <DialogContent
      // onInteractOutside={(e) => e.preventDefault()}
      >
        <div>
          <DialogHeader className="flex gap-2 text-sm">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="px-1 text-muted-foreground"
              >
                AGD
              </Button>
              <span className="pl-1 pr-2">›</span>
              New task
            </div>
          </DialogHeader>
          <Input
            placeholder="Task title"
            className="text-md font-semibold p-0 border-none shadow-none focus:outline-none focus-visible:ring-0"
          />
          <Textarea
            id="link"
            placeholder="Add description..."
            className="p-0 border-none shadow-none focus:outline-none focus-visible:ring-0 max-h-[500px]"
          />
        </div>
        <div className="flex gap-2 mr-auto">
          <ComboboxStatus selectedStatus={currStatus} />
          <ComboboxPriority selectedPriority={currPriority} />
          <ComboboxAssignee selectedAssignee={currAssignee} />
          <MultiSelectCombobox
            selectionName="tags"
            selections={statuses}
            selected={currLabels}
          />
        </div>
        <DialogFooter>
          <TooltipButton
            size="icon"
            tooltip="Attach images and files."
            className="mr-auto"
          >
            <Paperclip className="h-4 w-4 shrink-0" />
          </TooltipButton>
          <DialogClose asChild>
            <Button type="submit" variant="default" size="sm">
              Create Task
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
