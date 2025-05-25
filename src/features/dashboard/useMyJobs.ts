import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../infrastructure/axios/client';
import { Job, CreateJobRequest, UpdateJobRequest } from '../jobs/types';
import { MyJobsState } from './types';

export function useMyJobs() {
  const [state, setState] = useState<MyJobsState>({
    jobs: [],
    isLoading: true,
    error: null
  });

  const fetchMyJobs = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await axiosClient.get('/jobs');
      setState(prev => ({ 
        ...prev, 
        jobs: response.data.jobs || [],
        isLoading: false 
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch your jobs. Please try again later.',
        isLoading: false 
      }));
    }
  }, []);

  const createJob = useCallback(async (jobData: CreateJobRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await axiosClient.post('/jobs', jobData);
      setState(prev => ({ 
        ...prev, 
        jobs: [...prev.jobs, response.data.job],
        isLoading: false 
      }));
      return response.data.job;
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: err.response?.data?.error || 'Failed to create job. Please try again.',
        isLoading: false 
      }));
      throw err;
    }
  }, []);

  const updateJob = useCallback(async (jobId: string, jobData: UpdateJobRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await axiosClient.put(`/jobs/${jobId}`, jobData);
      setState(prev => ({ 
        ...prev, 
        jobs: prev.jobs.map(job => job.id === jobId ? response.data.job : job),
        isLoading: false 
      }));
      return response.data.job;
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: err.response?.data?.error || 'Failed to update job. Please try again.',
        isLoading: false 
      }));
      throw err;
    }
  }, []);

  const deleteJob = useCallback(async (jobId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await axiosClient.delete(`/jobs/${jobId}`);
      setState(prev => ({ 
        ...prev, 
        jobs: prev.jobs.filter(job => job.id !== jobId),
        isLoading: false 
      }));
      return true;
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: err.response?.data?.error || 'Failed to delete job. Please try again.',
        isLoading: false 
      }));
      throw err;
    }
  }, []);

  const getJobById = useCallback(async (jobId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await axiosClient.get(`/jobs/${jobId}`);
      return response.data.job;
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: err.response?.data?.error || 'Failed to fetch job details. Please try again.',
        isLoading: false 
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  return {
    ...state,
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    refreshJobs: fetchMyJobs
  };
}
