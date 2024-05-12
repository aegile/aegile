import * as React from "react";

import { PiCellSignalNoneDuotone } from "react-icons/pi";
import { AiOutlineDash } from "react-icons/ai";
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

import { priorities } from "./data";
import { SelectPriority, SelectPriorityProps } from "./types";
import { cn } from "@/lib/utils";

export default function ComboboxPriority({
  selectedPriority,
  setSelectedPriority,
  isIcon = false,
}: SelectPriorityProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 justify-center bg-transparent",
              isIcon && "w-7",
              !selectedPriority && "text-muted-foreground",
            )}
          >
            {!selectedPriority ? (
              <div className="flex">
                <AiOutlineDash
                  className={cn("h-4 w-4 shrink-0", !isIcon && "mr-1")}
                />
                {!isIcon && "Priority"}
              </div>
            ) : (
              <>
                <selectedPriority.icon
                  className={cn("h-4 w-4 shrink-0", !isIcon && "mr-1")}
                />
                {!isIcon && selectedPriority.label}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Change priority..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="none"
                  onSelect={(value) => {
                    setSelectedPriority(null);
                    setOpen(false);
                  }}
                >
                  <AiOutlineDash className="mr-2 h-4 w-4" />
                  None
                  {!selectedPriority && <span className="ml-auto">✓</span>}
                </CommandItem>
                {priorities.map((pty) => (
                  <CommandItem
                    key={pty.value}
                    value={pty.value}
                    onSelect={(value) => {
                      setSelectedPriority(
                        priorities.find((pty) => pty.value === value) ||
                          priorities[0],
                      );
                      setOpen(false);
                    }}
                  >
                    <pty.icon className="mr-2 h-4 w-4" />

                    {pty.label}
                    {selectedPriority &&
                      pty.value === selectedPriority.value && (
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
