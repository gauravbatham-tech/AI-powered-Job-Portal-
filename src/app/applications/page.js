'use client';

import { useEffect, useState } from 'react';
import { applicationService } from '@/services';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const params = filter ? { status: filter } : {};
        const res = await applicationService.getCandidateApplications(params);
        setApplications(res.data.applications);
      } catch {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'candidate') fetchApplications();
  }, [user, filter]);

  const statusColor = (status) => {
    const map = {
      applied: 'text-blue-400',
      screening: 'text-yellow-400',
      interview_scheduled: 'text-purple-400',
      shortlisted: 'text-green-400',
      rejected: 'text-red-400',
      offered: 'text-emerald-400',
      accepted: 'text-emerald-400',
    };
    return map[status] || 'text-gray-400';
  };

  return (
    <ProtectedRoute allowedRoles={['candidate']}>

      <div className="min-h-screen ai-bg px-6 py-12">

        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">My Applications</h1>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm focus:outline-none"
            >
              <option value="">All</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="offered">Offered</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          {/* CONTENT */}
          {loading && (
            <div className="glass p-12 text-center muted">
              Loading applications...
            </div>
          )}

          {error && (
            <div className="glass p-12 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && applications.length === 0 && (
            <div className="glass p-14 text-center muted">
              No applications yet.
            </div>
          )}

          {/* LIST */}
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="glass glass-hover p-6">

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {app.jobId?.title}
                    </h3>
                    <p className="muted text-sm">
                      {app.jobId?.companyName}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold uppercase ${statusColor(app.status)}`}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm muted">
                  <span>
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </span>

                  <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                    View →
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

    </ProtectedRoute>
  );
}
