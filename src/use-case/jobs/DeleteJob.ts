import { IJobRepository } from '../../infrastructure/ports/IJobRepository';

export class DeleteJob {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(id: string): Promise<void> {
    await this.jobRepository.delete(id);
  }
}
