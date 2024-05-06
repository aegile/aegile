'use client';

import * as React from 'react';
import { addHours } from 'date-fns';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Tutorial } from '../types';
import { ClassInboxList } from './class-inbox-list';
import { ClassInboxDisplay } from './class-inbox-display';

const tutorials: Tutorial[] = [
  {
    id: '0',
    name: 'H14A',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), -3),
    location: 'Zoom',
  },
  {
    id: '1',
    name: 'H14B',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 1),
    location: 'Zoom',
  },
  {
    id: '2',
    name: 'H14C',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '3',
    name: 'H14D',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '4',
    name: 'H14E',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '5',
    name: 'H14F',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '6',
    name: 'H14G',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '7',
    name: 'H14H',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '8',
    name: 'H14I',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '9',
    name: 'H14J',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
  {
    id: '10',
    name: 'H14K',
    member_count: 20,
    capacity: 25,
    datetime: addHours(new Date(), 2),
    location: 'Zoom',
  },
];

export function ClassInbox() {
  const [selected, setSelected] = React.useState(tutorials[0].id);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full"
      >
        <ResizablePanel defaultSize={445} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center py-2 pl-1 p-4">
              <h1 className="text-xl font-bold">My Classes</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="backdrop-blur py-2 pl-1 p-4">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8 bg-background" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <ClassInboxList
                items={tutorials}
                selected={selected}
                setSelected={setSelected}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0"></TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={910} minSize={30}>
          <ClassInboxDisplay
            item={tutorials.find((item) => item.id === selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
