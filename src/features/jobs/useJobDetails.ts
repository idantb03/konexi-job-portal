import { useQuery } from '@tanstack/react-query';
import { publicAxiosClient } from '../../infrastructure/axios/client';
import { Job } from './types';

export function useJobDetails(jobId: string) {
  const {
    data: job,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['jobs', jobId],
    queryFn: async () => {
      try {
        const response = await publicAxiosClient.get(`/jobs/${jobId}`);
        return response.data.job as Job;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!jobId // Only run the query if we have a jobId
  });

  return {
    job,
    isLoading,
    error: error ? 'Failed to fetch job details. Please try again later.' : null,
    refetchJob: refetch
  };
} 

export function usePublicJobDetails(jobId: string) {
  const {
    data: job,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['jobs', jobId],
    queryFn: async () => {
      try {
        const response = await publicAxiosClient.get(`/jobs/public/${jobId}`);
        return response.data.job as Job;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!jobId // Only run the query if we have a jobId
  });

  return {
    job,
    isLoading,
    error: error ? 'Failed to fetch job details. Please try again later.' : null,
    refetchJob: refetch
  };
} 