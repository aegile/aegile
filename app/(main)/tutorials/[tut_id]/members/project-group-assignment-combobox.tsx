"use client";

import * as React from "react";

import { Check, ChevronsUpDown, UserPlus2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function ProjectGroupAssignmentCombobox() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <UserPlus2Icon className="mr-1 h-4 w-4 shrink-0" />
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search framework..."
            value={query}
            onValueChange={(value: string) => setQuery(value)}
          />
          <CommandEmpty className="flex space-x-1 p-1 text-sm">
            <Button
              variant="ghost"
              size="xs"
              className="flex w-full justify-start space-x-1 rounded-sm"
            >
              <p className="font-normal">Create: </p>
              <p className="block truncate font-semibold text-primary">
                {query}
              </p>
            </Button>
          </CommandEmpty>
          <CommandGroup>
            {frameworks.length <= 0 && (
              <CommandItem key="new" value="new">
                + create group
              </CommandItem>
            )}
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
