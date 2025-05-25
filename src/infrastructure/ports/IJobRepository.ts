import { Job } from '../../domain/entities/Job';

export interface JobFilters {
  location?: string | null;
  jobType?: string | null;
}

export interface IJobRepository {
  create(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findByUserId(userId: string): Promise<Job[]>;
  update(id: string, job: Partial<Omit<Job, 'id' | 'createdAt'>>): Promise<Job>;
  delete(id: string): Promise<void>;
  findAll(filters?: JobFilters): Promise<Job[]>;
}
