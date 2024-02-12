import React, { createContext, useState, useContext, ReactNode } from 'react';
import { tasks as TaskData } from '../data';
import { Task } from '@/lib/types';

interface TaskEditorContextProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

// Create the context
export const TaskEditorContext = createContext<TaskEditorContextProps>({
  tasks: [],
  setTasks: () => {},
});

// Create a provider component
export function TaskEditorContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tasks, setTasks] = useState(TaskData);

  return (
    <TaskEditorContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskEditorContext.Provider>
  );
}
