"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectsInboxList } from "./projects-inbox-list";
import { ProjectsInboxDisplay } from "./projects-inbox-dsiplay";
// import { AccountSwitcher } from './account-switcher';
// import { AssignmentInboxDisplay } from "./assignment-inbox-display";
// import { AssignmentInboxList } from "./assignment-inbox-list";
// // import { Nav } from './nav';
// import { type Assignment } from "../data";
// import AssignmentCreationDialog from "./assignment-creation-dialog";

type Assignment = {
  id: string;
  name: string;
  weighting: number;
  variant: string;
  description: string;
  deadline: string;
  labels: string[];
  archived: boolean;
};

interface ProjectsInboxProps<T extends Assignment> {
  items: T[];
}

export function ProjectsInbox<T extends Assignment>({
  items,
}: ProjectsInboxProps<T>) {
  const [selected, setSelected] = React.useState(items[0].id);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        // onLayout={(sizes: number[]) => {
        //   document.cookie = `react-resizable-panels:layout=${JSON.stringify(
        //     sizes
        //   )}`;
        // }}
        className="h-full"
      >
        <ResizablePanel defaultSize={30} minSize={30}>
          <Tabs defaultValue="ongoing">
            <div className="flex items-center p-4 py-2 pl-1">
              <h1 className="text-xl font-bold">Course Assignments</h1>
              <TabsList className="ml-auto">
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
            </div>
            <Separator />
            <div className="flex justify-between gap-x-3 py-2 pl-1 pr-4 backdrop-blur">
              <form className="w-full">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="bg-background pl-8" />
                </div>
              </form>
              {/* <AssignmentCreationDialog /> */}
            </div>
            <TabsContent value="ongoing" className="m-0">
              <ProjectsInboxList
                items={items.filter((item) => !item.archived)}
                selected={selected}
                setSelected={setSelected}
              />
              {/* <AssignmentInboxList
                items={items.filter((item) => !item.archived)}
                selected={selected}
                setSelected={setSelected}
              /> */}
            </TabsContent>
            <TabsContent value="archived" className="m-0"></TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} minSize={30}>
          <ProjectsInboxDisplay
            item={items.find((item) => item.id === selected) || null}
          />
          {/* <AssignmentInboxDisplay
            item={items.find((item) => item.id === selected) || null}
          /> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
