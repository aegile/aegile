import * as React from 'react';

import { Signal } from '@preact/signals-react';

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

import { SelectStatus, SelectStatusProps } from './types';
import { statuses } from './data';

export default function ComboboxStatus({ selectedStatus }: SelectStatusProps) {
  const [open, setOpen] = React.useState(false);

  function setSelectedStatus(status: SelectStatus | null) {
    if (!status) {
      status = statuses[0];
    }
    selectedStatus.value = status;
  }

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-center">
            {selectedStatus ? (
              <>
                <selectedStatus.value.icon className="mr-1 h-4 w-4 shrink-0" />
                {selectedStatus.value.label}
              </>
            ) : (
              <>+ Set status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(
                        statuses.find((priority) => priority.value === value) ||
                          null
                      );
                      setOpen(false);
                    }}
                  >
                    <status.icon className="mr-2 h-4 w-4" />
                    {status.label}
                    {status.value === selectedStatus.value?.value && (
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
