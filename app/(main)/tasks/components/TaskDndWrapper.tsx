import React from 'react';

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
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
} from '@dnd-kit/sortable';
import { TaskEditorContext } from '../contexts/TaskEditorContext';
import { SortableTaskCard } from './SortableTaskCard';

export default function TaskDndWrapper({
  dndStrategy,
}: {
  dndStrategy: SortingStrategy;
}) {
  const [activeId, setActiveId] = React.useState(null);
  const { tasks, setTasks } = React.useContext(TaskEditorContext);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        // delay: 0,
        distance: 10,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* verticalListSortingStrategy */}
      <SortableContext items={tasks} strategy={dndStrategy}>
        {tasks.map((task, index) => (
          <SortableTaskCard
            key={task.id}
            id={task.id}
            index={index}
            name={task.name}
            children={task.children}
          />
        ))}
      </SortableContext>
    </DndContext>
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
