'use client';

import { useAuthContext } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useMyJobs } from '@/features/dashboard/useMyJobs';
import Link from 'next/link';
import { useState } from 'react';
import { CreateJobRequest } from '@/features/jobs/types';
import { JobTypes } from '@/domain/enums/JobTypes';

export default function DashboardPage() {
  const { user, signOut } = useAuthContext();
  const { jobs, isLoading, error, createJob, deleteJob } = useMyJobs();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: JobTypes.FULL_TIME
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      await createJob(formData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        jobType: JobTypes.FULL_TIME
      });
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete);
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to delete job');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-indigo-600">Konexi Dashboard</h1>
                </div>
                <div className="ml-6 flex space-x-8">
                  <Link 
                    href="/jobs" 
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    View All Jobs
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    onClick={signOut}
                    className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details from Supabase Auth</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">User ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">My Jobs</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Jobs you've created</p>
                    </div>
                    <button
                      onClick={() => setShowCreateForm(!showCreateForm)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {showCreateForm ? 'Cancel' : 'Create Job'}
                    </button>
                  </div>

                  {showCreateForm && (
                    <div className="px-4 py-5 bg-gray-50 sm:px-6">
                      <form onSubmit={handleSubmit}>
                        {formError && (
                          <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">
                            {formError}
                          </div>
                        )}
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
                                {Object.values(JobTypes).map((type) => (
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
                            <button
                              type="button"
                              onClick={() => setShowCreateForm(false)}
                              disabled={isSubmitting}
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              {isSubmitting ? 'Creating...' : 'Create'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="border-t border-gray-200">
                    {isLoading ? (
                      <div className="text-center py-6">
                        <div className="spinner"></div>
                        <p className="mt-2 text-gray-600">Loading jobs...</p>
                      </div>
                    ) : error ? (
                      <div className="px-4 py-5 sm:px-6">
                        <div className="bg-red-50 p-4 rounded-md">
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500">You haven't created any jobs yet.</p>
                      </div>
                    ) : (
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
                                    <button 
                                      onClick={() => handleDeleteClick(job.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this job? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
