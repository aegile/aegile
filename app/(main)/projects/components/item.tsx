import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
};

const Items = ({ id, title }: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'px-2 py-4 rounded-md bg-white dark:bg-[#1a1c1e] shadow-md w-full cursor-grab',
        isDragging
          ? 'opacity-50 border-primary'
          : 'hover:bg-[#fbfbfb] hover:dark:bg-[#242629]'
      )}
    >
      <div className="flex items-center justify-between text-sm">
        {title}
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        {/* <DragHandleDots2Icon
          className="w-4 h-4 text-muted cursor-grab"
        /> */}
      </div>
    </div>
  );
};

export default Items;
