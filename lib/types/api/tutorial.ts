export interface Tutorial {
  id: string;
  name: string;
  capacity: number;
  member_count: number;
  day: string;
  start_time: string;
  end_time: string;
  location: string;
}

export interface TutorialMember {
  id: string;
  first_name: string;
  last_name: string;
  handle: string;
  email: string;
  role: string;
  group: string;
}
