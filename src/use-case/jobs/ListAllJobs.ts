import { IJobRepository, JobFilters } from '../../infrastructure/ports/IJobRepository';
import { Job } from '../../domain/entities/Job';

export class ListAllJobs {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(filters?: JobFilters): Promise<Job[]> {
    return this.jobRepository.findAll(filters);
  }
} 