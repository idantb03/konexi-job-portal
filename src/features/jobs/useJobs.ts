import { useState, useEffect } from 'react';
import axios from 'axios';
import { Job, JobFilters } from './types';

export function useJobs(filters?: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let url = '/api/jobs/public';
        const params = new URLSearchParams();
        
        if (filters?.location) {
          params.append('location', filters.location);
        }
        
        if (filters?.jobType) {
          params.append('jobType', filters.jobType);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        setJobs(response.data.jobs || []);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [filters?.location, filters?.jobType]);
  
  return { jobs, isLoading, error };
}
