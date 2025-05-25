import { JobTypes } from "@/domain/enums/JobTypes";

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: JobTypes
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: JobTypes;
}

export interface UpdateJobRequest {
  title?: string;
  company?: string;
  description?: string;
  location?: string;
  jobType?: JobTypes;
}

export interface JobFilters {
  location?: string | null;
  jobType?: JobTypes | null;
}
