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
