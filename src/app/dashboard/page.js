'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import { jobService } from '@/services';
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
        const res = await jobService.getAllJobs({ limit: 6 });
        setJobs(res.data.jobs);
      } catch {
        setError('Failed to load jobs');
      } finally {
        setJobsLoading(false);
      }
    };

    if (!loading) fetchJobs();
  }, [loading]);

  return (
    <ProtectedRoute>

      <div className="min-h-screen ai-bg px-6 py-10">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="glass p-8 mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.firstName}
              </h1>
              <p className="muted text-sm capitalize">
                Role: {user?.role}
              </p>
            </div>

            {/* AI SCORE */}
            {user?.role === 'candidate' && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm muted">AI Profile Score</span>
                <span className="text-2xl font-bold text-indigo-400">
                  78%
                </span>
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

            {user?.role === 'candidate' && (
              <>
                <Link href="/jobs" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">Browse Jobs</h3>
                  <p className="muted text-sm">AI-matched opportunities</p>
                </Link>

                <Link href="/applications" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">My Applications</h3>
                  <p className="muted text-sm">Track hiring progress</p>
                </Link>

                <Link href="/profile" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">Profile</h3>
                  <p className="muted text-sm">Improve AI score</p>
                </Link>
              </>
            )}

            {user?.role === 'recruiter' && (
              <>
                <Link href="/post-job" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">Post Job</h3>
                  <p className="muted text-sm">Create new opening</p>
                </Link>

                <Link href="/my-jobs" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">My Jobs</h3>
                  <p className="muted text-sm">Manage listings</p>
                </Link>

                <Link href="/applications" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">Applications</h3>
                  <p className="muted text-sm">Review candidates</p>
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link href="/admin/stats" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">Platform Stats</h3>
                  <p className="muted text-sm">Analytics overview</p>
                </Link>

                <Link href="/admin/users" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">Users</h3>
                  <p className="muted text-sm">Manage accounts</p>
                </Link>

                <Link href="/admin/jobs" className="glass glass-hover p-6">
                  <h3 className="font-semibold mb-1">Jobs</h3>
                  <p className="muted text-sm">Moderation</p>
                </Link>
              </>
            )}
          </div>

          {/* FEATURED JOBS */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Recommended Jobs
            </h2>

            {jobsLoading && (
              <div className="glass p-12 text-center muted">
                Loading jobs...
              </div>
            )}

            {error && (
              <div className="glass p-12 text-center text-red-400">
                {error}
              </div>
            )}

            {!jobsLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/jobs"
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View all jobs →
              </Link>
            </div>
          </div>

        </div>
      </div>

    </ProtectedRoute>
  );
}
