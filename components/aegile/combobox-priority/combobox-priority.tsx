import * as React from 'react';

import { PiCellSignalNoneDuotone } from 'react-icons/pi';

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

import { priorities } from './data';
import { SelectPriority, SelectPriorityProps } from './types';

export default function ComboboxPriority({
  selectedPriority,
}: SelectPriorityProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-center">
            {selectedPriority && selectedPriority.value.value !== 'none' ? (
              <>
                <selectedPriority.value.icon className="mr-1 h-4 w-4 shrink-0" />
                {selectedPriority.value.label}
              </>
            ) : (
              <div className="flex text-muted">
                <PiCellSignalNoneDuotone className="mr-1 h-4 w-4 shrink-0" />
                Priority
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Change priority..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {priorities.map((priority) => (
                  <CommandItem
                    key={priority.value}
                    value={priority.value}
                    onSelect={(value) => {
                      selectedPriority.value =
                        priorities.find(
                          (priority) => priority.value === value
                        ) || priorities[0];
                      setOpen(false);
                    }}
                  >
                    <priority.icon className="mr-2 h-4 w-4" />

                    {priority.label}
                    {priority.value === selectedPriority.value.value && (
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
