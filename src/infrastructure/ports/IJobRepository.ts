import { Job } from '../../domain/entities/Job';

export interface JobFilters {
  keyword?: string | null;
  jobType?: string | null;
  location?: string | null;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IJobRepository {
  create(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findByUserId(userId: string): Promise<Job[]>;
  update(id: string, job: Partial<Omit<Job, 'id' | 'createdAt'>>): Promise<Job>;
  delete(id: string): Promise<void>;
  findAll(filters?: JobFilters, pagination?: PaginationParams): Promise<PaginatedResult<Job>>;
}
