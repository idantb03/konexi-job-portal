import { JobRepository } from '../../../../infrastructure/supabase/repositories/JobRepository';
import { JobTypes } from '../../../../domain/enums/JobTypes';
import { Job } from '../../../../domain/entities/Job';
import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

// Create a mock for the QueryBuilder that from() returns
const mockQueryBuilder = {
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  single: jest.fn(),
};

jest.mock('../../../../infrastructure/supabase/client', () => ({
  supabaseAdmin: {
    from: jest.fn(() => mockQueryBuilder),
  }
}));

describe('JobRepository', () => {
  let repository: JobRepository;
  
  beforeEach(() => {
    jest.clearAllMocks();
    repository = new JobRepository();
  });

  const mockJob: Omit<Job, 'id' | 'createdAt'> = {
    userId: 'user-123',
    title: 'Software Engineer',
    company: 'Tech Company',
    description: 'Job description',
    location: 'Remote',
    jobType: JobTypes.FULL_TIME,
  };

  const mockJobResponse = {
    id: 'job-123',
    user_id: 'user-123',
    title: 'Software Engineer',
    company: 'Tech Company',
    description: 'Job description',
    location: 'Remote',
    job_type: 'Full-Time',
    created_at: '2023-04-01T00:00:00Z',
  };

  describe('create', () => {
    it('should create a job successfully', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockJobResponse,
        error: null,
      });

      const result = await repository.create(mockJob);

      expect(supabaseAdmin.from).toHaveBeenCalledWith('jobs');
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
        user_id: mockJob.userId,
        title: mockJob.title,
        company: mockJob.company,
        description: mockJob.description,
        location: mockJob.location,
        job_type: mockJob.jobType,
      });
      expect(result).toEqual({
        id: 'job-123',
        userId: 'user-123',
        title: 'Software Engineer',
        company: 'Tech Company',
        description: 'Job description',
        location: 'Remote',
        jobType: 'Full-Time',
        createdAt: expect.any(Date),
      });
    });

    it('should throw an error if creation fails', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      await expect(repository.create(mockJob)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find a job by id', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockJobResponse,
        error: null,
      });

      const result = await repository.findById('job-123');

      expect(supabaseAdmin.from).toHaveBeenCalledWith('jobs');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'job-123');
      expect(result).toEqual({
        id: 'job-123',
        userId: 'user-123',
        title: 'Software Engineer',
        company: 'Tech Company',
        description: 'Job description',
        location: 'Remote',
        jobType: 'Full-Time',
        createdAt: expect.any(Date),
      });
    });

    it('should return null if job not found', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      });

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a job', async () => {
      mockQueryBuilder.eq.mockResolvedValue({
        error: null,
      });

      await repository.delete('job-123');

      expect(supabaseAdmin.from).toHaveBeenCalledWith('jobs');
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'job-123');
    });

    it('should throw an error if deletion fails', async () => {
      mockQueryBuilder.eq.mockResolvedValue({
        error: new Error('Database error'),
      });

      await expect(repository.delete('job-123')).rejects.toThrow();
    });
  });
}); 