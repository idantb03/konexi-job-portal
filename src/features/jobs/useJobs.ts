import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Job, JobFilters } from './types';

interface PaginatedJobsResult {
  data: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useJobs(filters?: JobFilters, initialPage = 1, pageSize = 10) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize,
    totalPages: 0,
    totalCount: 0
  });

  const fetchJobs = useCallback(async (page: number = pagination.page) => {
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
      
      // Add pagination params
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get<PaginatedJobsResult>(url);
      setJobs(response.data.data || []);
      setPagination({
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      });
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.location, filters?.jobType, pageSize, pagination.page]);

  // Change page
  const changePage = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchJobs(newPage);
  }, [fetchJobs, pagination.totalPages]);
  
  useEffect(() => {
    fetchJobs(initialPage);
  }, [fetchJobs, initialPage]);
  
  return { 
    jobs, 
    isLoading, 
    error,
    pagination,
    changePage
  };
}
