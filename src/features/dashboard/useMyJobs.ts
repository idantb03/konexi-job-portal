import { useCallback } from 'react';
import axiosClient from '../../infrastructure/axios/client';
import { Job, CreateJobRequest, UpdateJobRequest } from '../jobs/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useMyJobs() {
  const queryClient = useQueryClient();
  
  // Fetch all jobs query
  const { 
    data: jobs = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await axiosClient.get('/jobs');
      return response.data.jobs || [];
    }
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (jobData: CreateJobRequest) => {
      const response = await axiosClient.post('/jobs', jobData);
      return response.data.job;
    },
    onSuccess: (newJob) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] = []) => [...oldJobs, newJob]);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, jobData }: { jobId: string; jobData: UpdateJobRequest }) => {
      const response = await axiosClient.put(`/jobs/${jobId}`, jobData);
      return response.data.job;
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] = []) => 
        oldJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      queryClient.invalidateQueries({ queryKey: ['jobs', updatedJob.id] });
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await axiosClient.delete(`/jobs/${jobId}`);
      return jobId;
    },
    onSuccess: (deletedJobId) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] = []) => 
        oldJobs.filter(job => job.id !== deletedJobId)
      );
      queryClient.invalidateQueries({ queryKey: ['jobs', deletedJobId] });
    }
  });

  // Get job by id
  const getJobById = useCallback(async (jobId: string) => {
    try {
      const response = await axiosClient.get(`/jobs/${jobId}`);
      return response.data.job;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    jobs,
    isLoading,
    error: error ? 'Failed to fetch your jobs. Please try again later.' : null,
    createJob: createJobMutation.mutateAsync,
    updateJob: (jobId: string, jobData: UpdateJobRequest) => 
      updateJobMutation.mutateAsync({ jobId, jobData }),
    deleteJob: deleteJobMutation.mutateAsync,
    isDeletingJob: (jobId: string) => deleteJobMutation.isPending && deleteJobMutation.variables === jobId,
    getJobById,
    refreshJobs: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
  };
}
