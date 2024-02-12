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
import { TaskEditorContext } from '../contexts/TaskEditorContext';

function TaskAssignCombobox({
  parentIndex,
  currIndex,
}: {
  parentIndex: number;
  currIndex: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(parentIndex);
  const { tasks, setTasks } = React.useContext(TaskEditorContext);

  function reassignParent(
    parentIndex: number,
    childIndex: number,
    targetIndex: number
  ) {
    setTasks((tasks) => {
      const newItems = [...tasks];
      const childItem =
        parentIndex >= 0
          ? newItems[parentIndex].children[childIndex]
          : newItems[childIndex];

      // push then pop, otherwise the index will be off
      newItems[targetIndex].children.push(childItem);
      parentIndex >= 0
        ? newItems[parentIndex].children.splice(childIndex, 1)
        : newItems.splice(childIndex, 1);

      return newItems;
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-6 w-fit max-w-[50%] truncate flex justify-start text-xs text-muted px-2"
        >
          <span className="w-full truncate">
            {value >= 0 ? `〉${tasks[value].name}` : '〉Assign parent'}
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
              {tasks.map((task, index) => {
                if (parentIndex >= 0 && index === parentIndex) return null; // is subtask, omit parent
                if (parentIndex < 0 && index === currIndex) return null; // is parent, omit self
                return (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      setValue(index);
                      reassignParent(parentIndex, currIndex, index);
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
