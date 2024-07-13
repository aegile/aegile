"use client";

import * as React from "react";

import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";

import { Assignment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AssignmentInboxList } from "./assignment-inbox-list";

interface AssignmentInboxProps {
  items: Assignment[];
}

export function AssignmentInbox({ items }: AssignmentInboxProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [selected, setSelected] = React.useState(items[0]?.id);

  return (
    <div
      className={cn(
        "sticky top-16 w-full max-w-full self-start transition-all duration-300 ease-in-out lg:max-w-sm lg:opacity-100 xl:max-w-md",
        collapsed ? "max-w-0" : "mr-4 lg:mr-0",
      )}
    >
      <Tabs defaultValue="ongoing">
        <div className="flex items-center">
          <TabsList
            className={cn(
              "grid w-full grid-cols-2 transition-all duration-300 ease-in-out",
              collapsed && "-ml-12 opacity-0 lg:ml-0 lg:opacity-100",
            )}
          >
            <TabsTrigger
              value="ongoing"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Ongoing
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Archived
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "float sticky top-16 h-9 w-9 shrink-0 lg:hidden",
              collapsed ? "ml-10" : " ml-1",
            )}
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <TabsContent value="ongoing">
          <ScrollArea
            className={cn(
              "h-[calc(100vh-8rem)] transition-all duration-300 ease-in-out",
              collapsed && "opacity-0 lg:opacity-100",
            )}
          >
            <AssignmentInboxList
              items={items.filter((item) => !item.archived)}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <AssignmentCreationDialog /> */}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="archived">
          <ScrollArea
            className={cn(
              "h-[calc(100vh-8rem)] transition-all duration-300 ease-in-out",
              collapsed && "opacity-0 lg:opacity-100",
            )}
          >
            <AssignmentInboxList
              items={items.filter((item) => item.archived)}
              selected={selected}
              setSelected={setSelected}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// {/* Right Panel */}
// {/* <div className={cn("flex-1", !collapsed && "hidden lg:block")}>
//   <AssignmentInboxDisplay
//     item={items.find((item) => item.id === selected) || null}
//   />
// </div> */}
