import * as React from "react";
import { CircleUser } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { SelectAssigneeProps } from "./types";
import { assignees } from "./data";
import { cn } from "@/lib/utils";

export default function ComboboxAssignee({
  selectedAssignee,
  setSelectedAssignee,
  isIcon = false,
}: SelectAssigneeProps) {
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
              isIcon && "w-7 px-0",
              !selectedAssignee && "text-muted-foreground",
            )}
          >
            {!selectedAssignee ? (
              <div className="flex">
                <CircleUser
                  className={cn("h-4 w-4 shrink-0", !isIcon && "mr-1")}
                />
                {!isIcon && "Assignee"}
              </div>
            ) : (
              <>
                <Avatar
                  className={cn(
                    "h-4 w-4 shrink-0 rounded-full",
                    !isIcon && "mr-1",
                  )}
                >
                  <AvatarImage src={selectedAssignee.icon} />
                  <AvatarFallback>
                    <CircleUser />
                  </AvatarFallback>
                </Avatar>
                {!isIcon && selectedAssignee.label}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Change Assignee..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="none"
                  onSelect={(value) => {
                    setSelectedAssignee(null);
                    setOpen(false);
                  }}
                >
                  <CircleUser className="mr-2 h-4 w-4" />
                  No Assignee
                  {!selectedAssignee && <span className="ml-auto">✓</span>}
                </CommandItem>
                {assignees.map((assignee) => (
                  <CommandItem
                    key={assignee.value}
                    value={assignee.value}
                    onSelect={(value) => {
                      setSelectedAssignee(
                        assignees.find(
                          (priority) => priority.value === value,
                        ) || assignees[0],
                      );
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
                    {selectedAssignee &&
                      assignee.value === selectedAssignee.value && (
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
