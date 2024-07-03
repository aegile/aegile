export interface Deliverable {
  id: string;
  name: string;
  weighting: number;
  deadline: Date;
  description?: string;
  status: string;
  files?: Array<string>;
}
