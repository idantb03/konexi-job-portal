import { Job } from '../jobs/types';

export interface MyJobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
}

export interface JobDetailsState {
  job: Job | null;
  isLoading: boolean;
  error: string | null;
}
