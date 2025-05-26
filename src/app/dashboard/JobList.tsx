import Link from 'next/link';
import { Job } from '@/features/jobs/types';
import { Button } from '@/components/Button';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  onDeleteClick: (jobId: string) => void;
}

export function JobList({ jobs, isLoading, error, onDeleteClick }: JobListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="spinner"></div>
        <p className="mt-2 text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">You haven't created any jobs yet.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {jobs.map((job) => (
        <li key={job.id}>
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-indigo-600 truncate">{job.title}</h3>
              <div className="ml-2 flex-shrink-0 flex">
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {job.jobType.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  <span className="truncate">{job.company}</span>
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  <span className="truncate">{job.location}</span>
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <div className="flex space-x-2">
                  <Link href={`/dashboard/${job.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  <Button
                    onClick={() => onDeleteClick(job.id)}
                    variant="secondary"
                    className="!p-0 !text-red-600 hover:!text-red-900 !bg-transparent !border-none !shadow-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 