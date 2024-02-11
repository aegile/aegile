import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/lib/types';
import TaskEditorCard from './TaskEditorCard';

type TaskCardProps = Task & {
  index: number;
  parentIndex?: number;
  isSubtask?: boolean;
  rootTasks: Task[];
  unassignSubtask: (parentIndex: number, childIndex: number) => void;
};

export function SortableTaskCard(props: TaskCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-full"
    >
      <TaskEditorCard {...props} isCollapsed={isDragging} />
    </div>
  );
}
