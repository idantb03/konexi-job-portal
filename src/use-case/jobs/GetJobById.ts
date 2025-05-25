import { IJobRepository } from '../../infrastructure/ports/IJobRepository';
import { Job } from '../../domain/entities/Job';

export class GetJobById {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(id: string): Promise<Job | null> {
    return this.jobRepository.findById(id);
  }
}
