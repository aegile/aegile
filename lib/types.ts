type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

type Course = {
  id: string;
  term: string;
  code: string;
  name: string;
  member_count: number;
  deliverables?: number;
  labels?: string[];
};

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  handle: string;
  image?: string;
  role?: string;
};

type Tutorial = {
  id: string;
  name: string;
  capacity: number;
  member_count: number;
  day: Day;
  times: string;
  location: string;
};

export type Task = {
  id: string;
  project_id: string;
  name: string;
  creator_id: string;
  parent_task_id?: string;
  status: string;
  description?: string;
  deadline: string;
  weighting: number;
  priority: string;
  attachment?: string;
  member_count: number;
  // children: Task[];
  // canHaveChildren?: boolean;
  // due_date: string;
  // course_id: string;
  // user_id: string;
  // completed: boolean;
  // created_at: string;
  // updated_at: string;
  // completed_at: string;
  // labels: string[];
};
