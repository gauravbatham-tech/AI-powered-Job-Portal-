'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import { jobService } from '@/services/index';
import JobCard from '@/components/JobCard';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getAllJobs({ limit: 6 });
        setJobs(response.data.jobs);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setJobsLoading(false);
      }
    };

    if (!loading) {
      fetchJobs();
    }
  }, [loading]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.firstName}!
              </h1>
              <div className="text-sm text-gray-600">
                Role: <span className="font-semibold capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Role-based Navigation */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {user?.role === 'candidate' && (
              <>
                <Link href="/jobs" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
                  <div className="font-semibold">Browse Jobs</div>
                  <div className="text-sm">Find your next opportunity</div>
                </Link>
                <Link href="/applications" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700">
                  <div className="font-semibold">My Applications</div>
                  <div className="text-sm">Track your applications</div>
                </Link>
                <Link href="/profile" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
                  <div className="font-semibold">My Profile</div>
                  <div className="text-sm">Update your information</div>
                </Link>
              </>
            )}

            {user?.role === 'recruiter' && (
              <>
                <Link href="/post-job" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
                  <div className="font-semibold">Post a Job</div>
                  <div className="text-sm">Create a new job posting</div>
                </Link>
                <Link href="/my-jobs" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700">
                  <div className="font-semibold">My Jobs</div>
                  <div className="text-sm">Manage your postings</div>
                </Link>
                <Link href="/applications" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
                  <div className="font-semibold">Applications</div>
                  <div className="text-sm">Review applications</div>
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link href="/admin/stats" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
                  <div className="font-semibold">Statistics</div>
                  <div className="text-sm">Platform analytics</div>
                </Link>
                <Link href="/admin/users" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700">
                  <div className="font-semibold">Users</div>
                  <div className="text-sm">Manage users</div>
                </Link>
                <Link href="/admin/jobs" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
                  <div className="font-semibold">Jobs</div>
                  <div className="text-sm">Manage job postings</div>
                </Link>
              </>
            )}
          </div>

          {/* Featured Jobs */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            
            {jobsLoading ? (
              <div className="text-center py-12">Loading jobs...</div>
            ) : error ? (
              <div className="text-red-600 py-12">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-semibold">
                View all jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
