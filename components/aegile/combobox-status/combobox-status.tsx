import * as React from "react";

import { Signal } from "@preact/signals-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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

import { SelectStatus, SelectStatusProps } from "./types";
import { statuses } from "./data";
import { cn } from "@/lib/utils";

export default function ComboboxStatus({
  selectedStatus,
  setSelectedStatus,
  isIcon = false,
  btnVariant = "outline",
}: SelectStatusProps) {
  const [open, setOpen] = React.useState(false);

  function setStatus(status: SelectStatus | null) {
    if (!status) {
      status = statuses[0];
    }
    setSelectedStatus(status);
  }

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={btnVariant}
            size="sm"
            className={`h-7 justify-center bg-transparent ${isIcon && "mr-1 w-7"}`}
          >
            {selectedStatus ? (
              <>
                <selectedStatus.icon
                  className={cn("h-4 w-4 shrink-0", !isIcon && "mr-1 px-0")}
                />
                {!isIcon && selectedStatus.label}
              </>
            ) : (
              <>+ Set status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    defaultChecked={status.value === selectedStatus.value}
                    onSelect={(value) => {
                      console.log("🚀 ~ value:", value);
                      setStatus(
                        statuses.find((priority) => priority.value === value) ||
                          null,
                      );
                      setOpen(false);
                    }}
                  >
                    <status.icon className="mr-2 h-4 w-4" />
                    {status.label}
                    {status.value === selectedStatus.value && (
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
