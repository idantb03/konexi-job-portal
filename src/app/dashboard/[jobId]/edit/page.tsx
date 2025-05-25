'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyJobs } from '@/features/dashboard/useMyJobs';
import { UpdateJobRequest } from '@/features/jobs/types';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { JobTypes } from '@/domain/enums/JobTypes';

type PageParams = {
  jobId: string;
};

export default function EditJobPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const { getJobById, updateJob } = useMyJobs();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unwrappedParams = use(params);
  const [formData, setFormData] = useState<UpdateJobRequest>({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: JobTypes.FULL_TIME
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = await getJobById(unwrappedParams.jobId);
        if (job) {
          setFormData({
            title: job.title,
            company: job.company,
            description: job.description,
            location: job.location,
            jobType: job.jobTypes
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch job');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [unwrappedParams.jobId, getJobById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await updateJob(unwrappedParams.jobId, formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update job');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="spinner"></div>
                  <p className="mt-2 text-gray-600">Loading job details...</p>
                </div>
              ) : error ? (
                <div className="px-4 py-5 sm:px-6">
                  <div className="bg-red-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <Link href="/dashboard" className="text-sm text-red-700 font-medium hover:text-red-900">
                        Return to Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="company"
                            id="company"
                            required
                            value={formData.company}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="location"
                            id="location"
                            required
                            value={formData.location}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                          Job Type
                        </label>
                        <div className="mt-1">
                          <select
                            id="jobType"
                            name="jobType"
                            required
                            value={formData.jobType}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          >
                            {(Object.values(JobTypes) as JobTypes[]).map((type) => (
                              <option key={type} value={type}>
                                {type.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={4}
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <Link
                          href="/dashboard"
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
