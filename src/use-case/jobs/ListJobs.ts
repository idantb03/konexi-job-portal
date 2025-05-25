import { IJobRepository } from '../../infrastructure/ports/IJobRepository';
import { Job } from '../../domain/entities/Job';

export class ListJobs {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(userId: string): Promise<Job[]> {
    return this.jobRepository.findByUserId(userId);
  }
}
