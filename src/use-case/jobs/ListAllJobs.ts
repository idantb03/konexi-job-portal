import { IJobRepository, JobFilters, PaginationParams, PaginatedResult } from '../../infrastructure/ports/IJobRepository';
import { Job } from '../../domain/entities/Job';

export class ListAllJobs {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(filters?: JobFilters, pagination?: PaginationParams): Promise<PaginatedResult<Job>> {
    return this.jobRepository.findAll(filters, pagination);
  }
} 