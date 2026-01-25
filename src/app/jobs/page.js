'use client';

import { useEffect, useState } from 'react';
import { jobService } from '@/services';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import JobCard from '@/components/JobCard';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    experienceLevel: '',
    location: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchJobs();
  }, [filters.page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getAllJobs(filters);
      setJobs(res.data.jobs);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <ProtectedRoute>

      <div className="min-h-screen ai-bg px-6 py-12">

        <div className="max-w-7xl mx-auto">

          {/* SEARCH PANEL */}
          <div className="glass p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6">
              Discover AI-Matched Jobs
            </h2>

            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <input
                name="keyword"
                placeholder="Role or keyword"
                value={filters.keyword}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none"
              />

              <input
                name="category"
                placeholder="Category"
                value={filters.category}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none"
              />

              <input
                name="experienceLevel"
                placeholder="Experience"
                value={filters.experienceLevel}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none"
              />

              <input
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none"
              />

              <button
                type="submit"
                className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition"
              >
                Search Jobs
              </button>
            </form>
          </div>

          {/* JOB LIST */}
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

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="col-span-full text-center muted py-12">
                    No jobs found. Try different filters.
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              {jobs.length > 0 && (
                <div className="flex justify-center items-center gap-6">
                  <button
                    disabled={filters.page === 1}
                    onClick={() =>
                      setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                    }
                    className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="muted text-sm">
                    Page {filters.page}
                  </span>

                  <button
                    onClick={() =>
                      setFilters((p) => ({ ...p, page: p.page + 1 }))
                    }
                    className="px-5 py-2 rounded-xl bg-white/5 border border-white/10"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

    </ProtectedRoute>
  );
}
