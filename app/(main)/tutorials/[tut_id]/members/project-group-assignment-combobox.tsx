"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Row, Table } from "@tanstack/react-table";
import { Check, ChevronsUpDown, UserPlus2Icon } from "lucide-react";
import { toast } from "sonner";

import { TutorialMember } from "@/lib/types";
import { clientFetch, cn } from "@/lib/utils";
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

interface ProjectGroups {
  id: string;
  name: string;
}

export function ProjectGroupAssignmentCombobox({
  table,
}: {
  table: Table<TutorialMember>;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");
  const [value, setValue] = React.useState("");
  const [groups, setGroups] = React.useState<ProjectGroups[]>([]);

  const router = useRouter();
  const { tut_id } = useParams();
  const searchParams = useSearchParams();
  const ass_id = searchParams.get("ass_id");

  React.useEffect(() => {
    clientFetch(
      `/api/projects?tutorial_id=${tut_id}&assignment_id=${ass_id}`,
      "GET",
    )
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [ass_id]);

  async function handleEnrolUsers(project_id: string, user_ids: string[]) {
    if (!project_id) return;

    await clientFetch(`/api/projects/${project_id}/members`, "POST", {
      user_ids,
    })
      .then((data) => {
        toast.success(`Selected users enrolled successfully!`);
        setOpen(false);
        router.refresh();
      })
      .catch((error) => toast.error(error.message));
  }

  async function handleCreateGroup() {
    toast.info(`Creating group ${query}...`);
    const values = {
      assignment_id: ass_id,
      tutorial_id: tut_id,
      name: query,
      description: "",
    };

    const project_id = await clientFetch(`/api/projects`, "POST", values)
      .then((data) => {
        toast.success(`New group ${query} created successfully!`);
        return data.project_id;
      })
      .catch((error) => {
        toast.error(error.message);
      });

    await handleEnrolUsers(
      project_id,
      table.getSelectedRowModel().rows.map((row) => row.getValue("id")),
    );
  }

  React.useEffect(() => {
    if (value && table.getSelectedRowModel().rows.length > 0) {
      handleEnrolUsers(
        value,
        table.getSelectedRowModel().rows.map((row) => row.getValue("id")),
      );
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <UserPlus2Icon className="mr-1 h-4 w-4 shrink-0" />
          {value
            ? groups.find((group) => group.id === value)?.name
            : "Select group..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={
              groups.length > 0 ? "Search/create group..." : "Create a group"
            }
            value={query}
            onValueChange={(value: string) => setQuery(value)}
          />
          <CommandEmpty className="flex space-x-1 p-1 text-sm">
            <Button
              variant="ghost"
              size="xs"
              className="flex w-full justify-start space-x-1 rounded-sm"
              onClick={handleCreateGroup}
            >
              <p className="font-normal">Create: </p>
              <p className="block truncate font-semibold text-primary">
                {query}
              </p>
            </Button>
          </CommandEmpty>
          <CommandGroup>
            {groups.map((group) => (
              <CommandItem
                key={group.id}
                value={group.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === group.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {group.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
