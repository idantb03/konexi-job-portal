'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyJobs } from '@/features/dashboard/useMyJobs';
import { useJobDetails } from '@/features/jobs/useJobDetails';
import { UpdateJobRequest } from '@/features/jobs/types';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { JobTypes } from '@/domain/enums/JobTypes';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';

type PageParams = {
  jobId: string;
};

export default function EditJobPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const { updateJob, refreshJobs } = useMyJobs();
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const unwrappedParams = use(params);
  const { job, isLoading: isJobLoading } = useJobDetails(unwrappedParams.jobId);
  
  const [formData, setFormData] = useState<UpdateJobRequest>({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: JobTypes.FULL_TIME
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        jobType: job.jobType
      });
    }
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUpdating(true);
    
    try {
      await updateJob(unwrappedParams.jobId, formData);
      await refreshJobs();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update job');
    } finally {
      setIsUpdating(false);
    }
  };

  const jobTypeOptions = (Object.values(JobTypes) as JobTypes[]).map((type) => ({
    value: type,
    label: type.replace('_', ' ')
  }));

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
              {isJobLoading ? (
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
                      <Input
                        label="Job Title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                      />

                      <Input
                        label="Company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                      />

                      <Input
                        label="Location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                      />

                      <Select
                        label="Job Type"
                        name="jobType"
                        required
                        value={formData.jobType}
                        onChange={handleInputChange}
                        options={jobTypeOptions}
                      />

                      <Textarea
                        label="Description"
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <Link
                          href="/dashboard"
                          className={`bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={(e) => isUpdating && e.preventDefault()}
                        >
                          Cancel
                        </Link>
                        <Button
                          type="submit"
                          className="ml-3"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Updating...
                            </div>
                          ) : (
                            'Update'
                          )}
                        </Button>
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
