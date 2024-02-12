'use client';

import * as React from 'react';

import { LayoutGrid, LayoutList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TaskEditorContextProvider } from './contexts/TaskEditorContext';
import TaskDndWrapper from './components/TaskDndWrapper';
import {
  rectSwappingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function CollapsibleDemo() {
  return (
    <TaskEditorContextProvider>
      <div className="h-screen flex flex-grow flex-col p-8 space-y-6 overflow-y-auto">
        <h2 className="text-3xl font-semibold tracking-tight">My Tasks</h2>
        <Tabs defaultValue="grid-view" className="h-full">
          <div className="flex items-center ml-auto space-x-2">
            <TabsList>
              <TabsTrigger value="grid-view">
                <LayoutGrid className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="list-view">
                <LayoutList className="w-5 h-5" />
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="grid-view">
            <div className="lg:columns-2 xl:columns-3 space-y-4">
              <TaskDndWrapper dndStrategy={rectSwappingStrategy} />
            </div>
          </TabsContent>
          <TabsContent value="list-view">
            <div className="w-full h-full flex flex-col justify-center items-center space-y-4">
              <TaskDndWrapper dndStrategy={verticalListSortingStrategy} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TaskEditorContextProvider>
  );
}
