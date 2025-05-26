'use client';

import { useAuthContext } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useMyJobs } from '@/features/dashboard/useMyJobs';
import Link from 'next/link';
import { useState } from 'react';
import { CreateForm } from '@/components/CreateForm';
import { DeleteModal } from '@/components/DeleteModal';
import { JobList } from '@/app/dashboard/JobList';
import { Button } from '@/components/Button';

export default function DashboardPage() {
  const { user, signOut } = useAuthContext();
  const { jobs, isLoading, error, createJob, deleteJob, isDeletingJob } = useMyJobs();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    setShowDeleteModal(false);
    setJobToDelete(null);
    try {
      await deleteJob(jobToDelete);
    } catch (err: any) {
      console.error('Failed to delete job:', err);
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
                    href="/" 
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    View All Jobs
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Button onClick={async () => {
                    await signOut();
                    window.location.href = '/';
                  }}>
                    Sign out
                  </Button>
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
                    <Button
                      onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                      {showCreateForm ? 'Cancel' : 'Create Job'}
                    </Button>
                  </div>

                  {showCreateForm && (
                    <CreateForm
                      onSubmit={async (data) => {
                        await createJob(data);
                        setShowCreateForm(false);
                      }}
                      onCancel={() => setShowCreateForm(false)}
                    />
                  )}

                  <div className="border-t border-gray-200">
                    <JobList
                      jobs={jobs}
                      isLoading={isLoading}
                      error={error}
                      onDeleteClick={handleDeleteClick}
                      isDeletingJob={isDeletingJob}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </ProtectedRoute>
  );
}
