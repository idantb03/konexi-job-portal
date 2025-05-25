import { JobTypes } from "../enums/JobTypes";

export interface Job {
  id: string;
  userId: string;
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: JobTypes;
  createdAt: Date;
}
