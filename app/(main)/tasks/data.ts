import { Task } from '@/lib/types';

export const tasks: Task[] = [
  {
    id: '1task1',
    name: 'Task 1 lasgaohgoias gas oigoias hoig hoasih goi hasoihgoih asoihgo aso hgh sa',
    children: [{ id: '1subtask1', name: 'Subtask 1', children: [] }],
  },
  {
    id: '2task2',
    name: 'Task 2',
    children: [],
  },
  {
    id: '3task3',
    name: 'Task 3',
    children: [
      { id: '3subtask3', name: 'Subtask 3', children: [] },
      { id: '3subtask4', name: 'Subtask 4', children: [] },
    ],
  },
  {
    id: '4task4',
    name: 'Task 4',
    children: [{ id: '4subtask4', name: 'Subtask 5', children: [] }],
  },
  {
    id: '5task5',
    name: 'Task 5 lasgaohgoias gas oigoias hoig hoasih goi hasoihgoih asoihgo aso hgh sa',
    children: [],
  },
  {
    id: '6task6',
    name: 'Task 6 ',
    children: [],
  },
  {
    id: '7task7',
    name: 'Task 7',
    children: [],
  },
  {
    id: '8task8',
    name: 'Task 8',
    children: [],
  },
  {
    id: '9task9',
    name: 'Task 9',
    children: [],
  },
];
