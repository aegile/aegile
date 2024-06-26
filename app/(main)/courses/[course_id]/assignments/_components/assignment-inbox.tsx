"use client";

import * as React from "react";

import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { type Assignment } from "../data";
import AssignmentCreationDialog from "./assignment-creation-dialog";
import { AssignmentInboxDisplay } from "./assignment-inbox-display";
import { AssignmentInboxList } from "./assignment-inbox-list";

interface AssignmentInboxProps {
  items: Assignment[];
}

export function AssignmentInbox({ items }: AssignmentInboxProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [selected, setSelected] = React.useState(items[0].id);

  return (
    <div className="flex ">
      {/* Left Panel */}
      <div
        className={cn(
          "sticky top-16 w-full self-start transition-all lg:w-[35%] lg:opacity-100 xl:w-[25%]",
          collapsed && "w-0 opacity-0",
        )}
      >
        <Tabs defaultValue="ongoing">
          <TabsList className="grid w-full grid-cols-2">
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
          <TabsContent value="ongoing">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <AssignmentInboxList
                items={items.filter((item) => !item.archived)}
                selected={selected}
                setSelected={setSelected}
              />
              <AssignmentCreationDialog />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="archived">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <AssignmentInboxList
                items={items.filter((item) => item.archived)}
                selected={selected}
                setSelected={setSelected}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "float sticky top-16 lg:hidden",
          collapsed ? "-ml-2" : " -mr-2 ml-1",
        )}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? (
          <ChevronLeftIcon className="h-5 w-5" />
        ) : (
          <ChevronRightIcon className="h-5 w-5" />
        )}
      </Button>
      <div className="mx-3 hidden w-[1px] shrink-0 flex-grow bg-zinc-200 dark:bg-zinc-800 lg:block" />
      {/* Right Panel */}
      <div
        className={cn(
          "w-full lg:w-[65%] xl:w-[75%]",
          !collapsed && "hidden lg:block",
        )}
      >
        <AssignmentInboxDisplay
          item={items.find((item) => item.id === selected) || null}
        />
      </div>
    </div>
  );
}
