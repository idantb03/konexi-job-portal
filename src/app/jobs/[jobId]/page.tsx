'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useJobDetails } from '@/features/jobs/useJobDetails';

export default function JobDetailsPage() {
  const params = useParams();
  const unwrappedParams = params as { jobId: string };
  const { job, isLoading, error } = useJobDetails(unwrappedParams.jobId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error || 'Job not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
            <Link href="/jobs" className="text-indigo-600 hover:text-indigo-900">
              Back to Jobs
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.company}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className="px-2 py-1 text-sm inline-flex leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {job.jobType.replace('_', ' ')}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{job.description}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
