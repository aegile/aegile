import React from 'react';

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
import { Task } from '@/lib/types';

function TaskAssignCombobox({
  rootTasks,
  parentIndex,
  currIndex,
}: {
  rootTasks: Task[];
  parentIndex: number;
  currIndex: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(parentIndex);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        {/* <Button variant="ghost" size="icon" className="mr-2 h-6 w-6">
          <PlusIcon className="h-4 w-4" />
        </Button> */}
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-6 w-fit max-w-[50%] truncate flex justify-start text-xs text-muted px-2"
        >
          {/* <PlusIcon className="h-4 w-4 mr-1" /> */}
          <span className="w-full truncate">
            {value >= 0 ? `〉${rootTasks[value].name}` : '〉Assign parent'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput
            placeholder="Assign to parent task..."
            className="flex-grow"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {rootTasks.map((task, index) => {
                if (parentIndex >= 0 && index === parentIndex) return null;
                if (parentIndex < 0 && index === currIndex) return null;
                return (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      setValue(index);
                      setOpen(false);
                    }}
                  >
                    {task.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default TaskAssignCombobox;
