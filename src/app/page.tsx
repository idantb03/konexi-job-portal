'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useJobs } from '@/features/jobs/useJobs';
import { JobTypes } from '@/domain/enums/JobTypes';
import { Pagination } from '@/components/Pagination';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { useDebounce } from '@/hooks/useDebounce';

export default function JobsPage() {
  const [keyword, setKeyword] = useState<string>('');
  const [jobType, setJobType] = useState<JobTypes | null>(null);
  const [location, setLocation] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedLocation = useDebounce(location, 500);
  
  const { jobs, isLoading, error, pagination, changePage } = useJobs(
    { 
      keyword: debouncedKeyword || null, 
      jobType,
      location: debouncedLocation || null 
    },
    currentPage
  );

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword('');
    setJobType(null);
    setLocation('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    changePage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Filter Jobs</h2>
              <form onSubmit={handleClear} className="flex flex-wrap gap-4">
                <div className="w-full sm:w-auto">
                  <Input
                    id="keyword"
                    name="keyword"
                    label="Search Jobs"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search by title, company, or description"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Select
                    id="jobType"
                    name="jobType"
                    label="Job Type"
                    value={jobType || ''}
                    onChange={(e) => setJobType(e.target.value ? e.target.value as JobTypes : null)}
                    options={[
                      { value: '', label: 'Any type' },
                      ...Object.values(JobTypes).map((type) => ({
                        value: type,
                        label: type.replace('_', ' ')
                      }))
                    ]}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Input
                    id="location"
                    name="location"
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Filter by location"
                  />
                </div>
                <div className="w-full sm:w-auto self-end">
                  <Button type="submit">
                    Clear
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="spinner"></div>
              <p className="mt-2 text-gray-600">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <ul className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <li key={job.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <Link href={`/${job.id}`} className="block">
                        <div className="px-6 py-4 sm:px-8 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-indigo-600">{job.title}</h3>
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {job.jobType.replace('_', ' ')}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalCount={pagination.totalCount}
                  pageSize={pagination.pageSize}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
