import { GetJobById } from '../../../use-case/jobs/GetJobById';
import { IJobRepository } from '../../../infrastructure/ports/IJobRepository';
import { JobTypes } from '../../../domain/enums/JobTypes';

describe('GetJobById', () => {
  const mockJob = {
    id: 'job-123',
    userId: 'user-123',
    title: 'Software Engineer',
    company: 'Tech Company',
    description: 'Job description',
    location: 'Remote',
    jobType: JobTypes.FULL_TIME,
    createdAt: new Date(),
  };

  let mockJobRepository: jest.Mocked<IJobRepository>;
  let getJobById: GetJobById;

  beforeEach(() => {
    mockJobRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<IJobRepository>;

    getJobById = new GetJobById(mockJobRepository);
  });

  it('should return a job when found by id', async () => {
    mockJobRepository.findById.mockResolvedValue(mockJob);

    const result = await getJobById.execute('job-123');

    expect(mockJobRepository.findById).toHaveBeenCalledWith('job-123');
    expect(result).toEqual(mockJob);
  });

  it('should return null when job is not found', async () => {
    mockJobRepository.findById.mockResolvedValue(null);

    const result = await getJobById.execute('non-existent-id');

    expect(mockJobRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(result).toBeNull();
  });
}); 