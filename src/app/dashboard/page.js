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

      <div className="min-h-screen ai-bg px-4 sm:px-6 py-6 sm:py-10">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="glass p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-6">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                Welcome back, {user?.firstName}
              </h1>
              <p className="muted text-xs sm:text-sm capitalize">
                Role: {user?.role}
              </p>
            </div>

            {/* AI SCORE */}
            {user?.role === 'candidate' && (
              <div className="flex sm:flex-col text-right flex-shrink-0">
                <span className="text-xs sm:text-sm muted">AI Profile Score</span>
                <span className="text-lg sm:text-2xl font-bold text-indigo-400 sm:ml-0 ml-auto">
                  78%
                </span>
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">

            {user?.role === 'candidate' && (
              <>
                <Link href="/jobs" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Browse Jobs</h3>
                  <p className="muted text-xs sm:text-sm">AI-matched opportunities</p>
                </Link>

                <Link href="/applications" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">My Applications</h3>
                  <p className="muted text-xs sm:text-sm">Track hiring progress</p>
                </Link>

                <Link href="/profile" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Profile</h3>
                  <p className="muted text-xs sm:text-sm">Improve AI score</p>
                </Link>
              </>
            )}

            {user?.role === 'recruiter' && (
              <>
                <Link href="/post-job" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Post Job</h3>
                  <p className="muted text-xs sm:text-sm">Create new opening</p>
                </Link>

                <Link href="/my-jobs" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">My Jobs</h3>
                  <p className="muted text-xs sm:text-sm">Manage listings</p>
                </Link>

                <Link href="/applications" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Applications</h3>
                  <p className="muted text-xs sm:text-sm">Review candidates</p>
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link href="/admin/stats" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Platform Stats</h3>
                  <p className="muted text-xs sm:text-sm">Analytics overview</p>
                </Link>

                <Link href="/admin/users" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Users</h3>
                  <p className="muted text-xs sm:text-sm">Manage accounts</p>
                </Link>

                <Link href="/admin/jobs" className="glass glass-hover p-4 sm:p-6">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Jobs</h3>
                  <p className="muted text-xs sm:text-sm">Moderation</p>
                </Link>
              </>
            )}
          </div>

          {/* FEATURED JOBS */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Recommended Jobs
            </h2>

            {jobsLoading && (
              <div className="glass p-8 sm:p-12 text-center muted text-sm sm:text-base">
                Loading jobs...
              </div>
            )}

            {error && (
              <div className="glass p-8 sm:p-12 text-center text-red-400 text-sm sm:text-base">
                {error}
              </div>
            )}

            {!jobsLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            <div className="text-center mt-8 sm:mt-10">
              <Link
                href="/jobs"
                className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm sm:text-base"
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
