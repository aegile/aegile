export interface Assignment {
  id: string;
  name: string;
  weighting: number;
  variant: string;
  description: string;
  deadline: string;
  labels: string[];
  archived: boolean;
}
