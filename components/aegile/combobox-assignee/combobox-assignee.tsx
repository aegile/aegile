import * as React from 'react';
import { CircleUser } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SelectAssigneeProps } from './types';
import { assignees } from './data';

export default function ComboboxAssignee({
  selectedAssignee,
}: SelectAssigneeProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-center">
            {selectedAssignee && selectedAssignee.value.value !== 'none' ? (
              <>
                {selectedAssignee.value.icon ? (
                  <img
                    src={selectedAssignee.value.icon}
                    className="mr-1 h-4 w-4 shrink-0 rounded-full"
                  />
                ) : (
                  <CircleUser className="mr-1 h-4 w-4 shrink-0" />
                )}
                {selectedAssignee.value.label}
              </>
            ) : (
              <div className="flex text-muted">
                <CircleUser className="mr-1 h-4 w-4 shrink-0" />
                Assignee
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Change Assignee..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {assignees.map((assignee) => (
                  <CommandItem
                    key={assignee.value}
                    value={assignee.value}
                    onSelect={(value) => {
                      selectedAssignee.value =
                        assignees.find(
                          (priority) => priority.value === value
                        ) || assignees[0];
                      setOpen(false);
                    }}
                  >
                    {assignee.icon ? (
                      <img
                        src={assignee.icon}
                        className="mr-2 h-4 w-4 rounded-full"
                      />
                    ) : (
                      <CircleUser className="mr-2 h-4 w-4" />
                    )}

                    {assignee.label}
                    {assignee.value === selectedAssignee.value?.value && (
                      <span className="ml-auto">✓</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
