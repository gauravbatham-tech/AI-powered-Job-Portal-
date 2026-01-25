'use client';

import { useEffect, useState } from 'react';
import { jobService } from '@/services/index';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import Link from 'next/link';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = filter ? { status: filter } : {};
        const response = await jobService.getRecruiterJobs(params);
        setJobs(response.data.jobs);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filter]);

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-green-100 text-green-800',
      'closed': 'bg-red-100 text-red-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <ProtectedRoute allowedRoles={['recruiter']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
            <Link 
              href="/post-job"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
            >
              + Post New Job
            </Link>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Jobs</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-12">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">No jobs posted yet.</p>
              <Link href="/post-job" className="text-blue-600 hover:text-blue-700 font-semibold mt-2">
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>Location: {job.location?.city}, {job.location?.country}</p>
                        <p>Experience: {job.experienceLevel}</p>
                        <p>Applications: {job.applicationsCount}</p>
                        <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getStatusColor(job.status)}`}>
                        {job.status.toUpperCase()}
                      </span>

                      <div className="flex flex-col gap-2 mt-4">
                        <Link 
                          href={`/jobs/${job.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/job-applications/${job.id}`}
                          className="text-green-600 hover:text-green-700 text-sm font-semibold"
                        >
                          Applications ({job.applicationsCount})
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
