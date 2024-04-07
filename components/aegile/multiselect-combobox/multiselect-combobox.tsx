import * as React from 'react';

import { Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';

interface SelectionBase {
  value: string;
  label: string;
  icon: React.ComponentType;
}

interface MultiSelectComboboxProps<T extends SelectionBase> {
  selectionName: string;
  selections: T[];
  selected: Signal<T[]>;
}

export default function MultiSelectCombobox<T extends SelectionBase>({
  selectionName,
  selections,
  selected,
}: MultiSelectComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  useSignals();
  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {selected.value.length > 0 ? (
              <>
                {selected.value.length === 1 ? (
                  selected.value[0].label
                ) : (
                  <>
                    {selected.value.length} {selectionName}
                  </>
                )}
              </>
            ) : (
              <Tag className="h-4 w-4 shrink-0 text-muted" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit" side="bottom" align="start">
          <Command>
            <CommandInput placeholder={`Change ${selectionName}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {[
                  ...selected.value,
                  ...selections.filter(
                    (option) => !selected.value.includes(option)
                  ),
                ].map((option) => (
                  //   <div className="flex items-center px-1 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <CommandItem
                    //   className="w-full aria-selected:bg-transparent dark:aria-selected:bg-transparent"
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      const isSelected = selected.value.includes(option);

                      selected.value = isSelected
                        ? selected.value.filter(
                            (selectedOption) =>
                              selectedOption.value !== option.value
                          )
                        : [...selected.value, option];

                      // setOpen(false);
                    }}
                  >
                    <Checkbox
                      id={option.value}
                      checked={selected.value.includes(option)}
                      className="mr-2"
                      // onCheckedChange={(checked) => {
                      //   if (checked) {
                      //     selected.value = [...selected.value, option];
                      //   } else {
                      //     selected.value = selected.value.filter(
                      //       (selectedOption) =>
                      //         selectedOption.value !== option.value
                      //     );
                      //   }
                      //   return checked;
                      // }}
                    />
                    {/* <option.icon className="mr-2 h-4 w-4" /> */}

                    {option.label}
                  </CommandItem>
                  //   </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
