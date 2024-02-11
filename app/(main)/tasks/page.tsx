'use client';

import * as React from 'react';

import { LayoutGrid, LayoutList } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { tasks } from './data';
import { SortableTaskCard } from './components/SortableTaskCard';
import { Task } from '@/lib/types';

// function extractIds(tasks: Task[]): string[] {
//   let ids: string[] = [];

//   for (const task of tasks) {
//     ids.push(task.id);

//     if (task.children.length > 0) {
//       ids = ids.concat(extractIds(task.children));
//     }
//   }

//   return ids;
// }

// const taskIds = extractIds(tasks);

function assignToPrecedingTask() {}

export default function CollapsibleDemo() {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = React.useState(tasks);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        // delay: 0,
        distance: 10,
      },
    })
  );

  function assignToParentTask(parentIndex: number, childIndex: number) {
    setItems((items) => {
      const newItems = [...items];
      const childItem = newItems[parentIndex].children[childIndex];
      newItems[parentIndex].children.splice(childIndex, 1);
      newItems.push(childItem);
      return newItems;
    });
  }
  function unassignFromParentTask(parentIndex: number, childIndex: number) {
    setItems((items) => {
      const newItems = [...items];
      const childItem = newItems[parentIndex].children[childIndex];
      newItems[parentIndex].children.splice(childIndex, 1);
      newItems.push(childItem);
      return newItems;
    });
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-full h-full flex">
        <div className="h-screen flex flex-grow flex-col p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">My Tasks</h2>
          </div>
          <Dialog>
            <Tabs defaultValue="list-view" className="h-full">
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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={items}
                      strategy={rectSwappingStrategy}
                    >
                      {items.map((task, index) => (
                        <SortableTaskCard
                          key={task.id}
                          id={task.id}
                          index={index}
                          name={task.name}
                          children={task.children}
                          rootTasks={items}
                          unassignSubtask={unassignFromParentTask}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </TabsContent>
              <TabsContent value="list-view">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="w-full h-full flex flex-col justify-center items-center space-y-4">
                      {items.map((task, index) => (
                        <SortableTaskCard
                          key={task.id}
                          id={task.id}
                          index={index}
                          name={task.name}
                          children={task.children}
                          rootTasks={items}
                          unassignSubtask={unassignFromParentTask}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </TabsContent>
            </Tabs>
          </Dialog>
        </div>
      </div>
    </div>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    console.log('🚀 ~ handleDragStart ~ event:', event);

    // setActiveId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log('🚀 ~ handleDragEnd ~ event:', event);
    // if (active.id !== over.id) {
    //   setItems((items) => {
    //     const oldIndex = items.indexOf(active.id);
    //     const newIndex = items.indexOf(over.id);
    //     return arrayMove(items, oldIndex, newIndex);
    //   });
    // }
    // setActiveId(null);
  }
}
