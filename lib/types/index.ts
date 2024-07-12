// lib/types/index.ts
export * from "./api";
export * from "./ui";

// TODO: Clean up the following into their own folders

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type Course = {
  id: string;
  term: string;
  code: string;
  name: string;
  member_count: number;
  deliverables?: number;
  labels?: string[];
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  handle: string;
  role: string;
  image: string;
};

export type Task = {
  id: string;
  name: string;
  children: Task[];
  canHaveChildren?: boolean;
  // description: string;
  // due_date: string;
  // course_id: string;
  // user_id: string;
  // completed: boolean;
  // created_at: string;
  // updated_at: string;
  // completed_at: string;
  // labels: string[];
};

// type MinimalViableProps = {
//   items: TreeItems<Task>;
//   setItems: React.Dispatch<SetStateAction<TreeItems<Task>>>;
// };
