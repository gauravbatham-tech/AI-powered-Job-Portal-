'use client';

import { useEffect, useState } from 'react';
import { jobService } from '@/services';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import Link from 'next/link';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const res = await jobService.getRecruiterJobs(params);
      setJobs(res.data.jobs);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    const map = {
      open: 'text-green-400',
      closed: 'text-red-400',
      archived: 'text-gray-400',
    };
    return map[status] || 'text-gray-400';
  };

  return (
    <ProtectedRoute allowedRoles={['recruiter']}>

      <div className="min-h-screen ai-bg px-6 py-12">

        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">My Job Postings</h1>

            <Link
              href="/post-job"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
            >
              + Post Job
            </Link>
          </div>

          {/* FILTER */}
          <div className="glass p-4 mb-8 w-56">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            >
              <option value="">All Jobs</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* CONTENT */}
          {loading && (
            <div className="glass p-12 text-center muted">
              Loading jobs...
            </div>
          )}

          {error && (
            <div className="glass p-12 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="glass p-14 text-center muted">
              No jobs posted yet.
              <div className="mt-3">
                <Link
                  href="/post-job"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Post your first job →
                </Link>
              </div>
            </div>
          )}

          {/* JOB CARDS */}
          <div className="space-y-5">
            {jobs.map((job) => (
              <div key={job.id} className="glass glass-hover p-6">

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {job.title}
                    </h3>
                    <p className="muted text-sm">
                      {job.location?.city}, {job.location?.country}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold uppercase ${statusColor(job.status)}`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm muted mb-4">
                  <div>Experience: {job.experienceLevel}</div>
                  <div>Applications: {job.applicationsCount}</div>
                  <div>Posted: {new Date(job.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-6 text-sm font-semibold">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    View
                  </Link>

                  <Link
                    href={`/job-applications/${job.id}`}
                    className="text-green-400 hover:text-green-300"
                  >
                    Applications ({job.applicationsCount})
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

    </ProtectedRoute>
  );
}
