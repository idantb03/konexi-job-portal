import { IJobRepository } from '../../infrastructure/ports/IJobRepository';
import { Job } from '../../domain/entities/Job';

export class CreateJob {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    return this.jobRepository.create(jobData);
  }
}
