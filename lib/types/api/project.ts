import { User } from "..";

export interface ProjectOverview {
  id: string;
  name: string;
  description: string;
  next_deadline: string;
  next_deliverable: string;
  member_count: number;
  members: User[];
}
