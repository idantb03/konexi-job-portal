import { useState, useCallback } from 'react';
import { publicAxiosClient } from '../../infrastructure/axios/client';
import { Job, JobFilters } from './types';
import { useQuery } from '@tanstack/react-query';

interface PaginatedJobsResult {
  data: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useJobs(filters?: JobFilters, initialPage = 1, pageSize = 10) {
  const [page, setPage] = useState(initialPage);
  
  const queryKey = ['jobs', { ...filters, page, pageSize }];
  
  const fetchJobs = useCallback(async ({ queryKey }: { queryKey: any[] }) => {
    const [, params] = queryKey;
    let url = '/jobs/public';
    const urlParams = new URLSearchParams();
    
    if (params.keyword) {
      urlParams.append('keyword', params.keyword);
    }
    
    if (params.jobType) {
      urlParams.append('jobType', params.jobType);
    }
    
    if (params.location) {
      urlParams.append('location', params.location);
    }
    
    // Add pagination params
    urlParams.append('page', params.page.toString());
    urlParams.append('pageSize', params.pageSize.toString());
    
    if (urlParams.toString()) {
      url += `?${urlParams.toString()}`;
    }
    
    const response = await publicAxiosClient.get<PaginatedJobsResult>(url);
    return response.data;
  }, []);

  const { 
    data, 
    isLoading, 
    error
  } = useQuery({
    queryKey,
    queryFn: fetchJobs
  });

  const jobs = data?.data || [];
  const pagination = {
    page: data?.page || page,
    pageSize: data?.pageSize || pageSize,
    totalPages: data?.totalPages || 0,
    totalCount: data?.totalCount || 0
  };

  const changePage = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo(0, 0);
  }, [pagination.totalPages]);
  
  return { 
    jobs, 
    isLoading, 
    error: error ? 'Failed to fetch jobs. Please try again later.' : null,
    pagination,
    changePage
  };
}
