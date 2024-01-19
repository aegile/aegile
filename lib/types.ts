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

type Class = {
  id: string;
  name: string;
  capacity: number;
  member_count: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  times: string;
  location: string;
};
