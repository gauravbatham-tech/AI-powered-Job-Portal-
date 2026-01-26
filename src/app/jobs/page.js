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

      <div className="min-h-screen ai-bg px-4 sm:px-6 py-8 sm:py-12">

        <div className="max-w-7xl mx-auto">

          {/* SEARCH PANEL */}
          <div className="glass p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Discover AI-Matched Jobs
            </h2>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

              <input
                name="keyword"
                placeholder="Role or keyword"
                value={filters.keyword}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-400"
              />

              <input
                name="category"
                placeholder="Category"
                value={filters.category}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-400"
              />

              <input
                name="experienceLevel"
                placeholder="Experience"
                value={filters.experienceLevel}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-400"
              />

              <input
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-400"
              />

              <button
                type="submit"
                className="sm:col-span-2 lg:col-span-4 bg-indigo-600 hover:bg-indigo-700 py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
              >
                Search Jobs
              </button>
            </form>
          </div>

          {/* JOB LIST */}
          {loading && (
            <div className="glass p-8 sm:p-12 text-center muted text-sm sm:text-base">
              Loading jobs...
            </div>
          )}

          {error && (
            <div className="glass p-8 sm:p-12 text-center text-red-400 text-sm sm:text-base">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="col-span-full text-center muted py-10 sm:py-12 text-sm sm:text-base">
                    No jobs found. Try different filters.
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              {jobs.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                  <button
                    disabled={filters.page === 1}
                    onClick={() =>
                      setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                    }
                    className="px-4 sm:px-5 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-40 text-sm sm:text-base hover:bg-white/10 transition"
                  >
                    ← Previous
                  </button>

                  <span className="muted text-xs sm:text-sm">
                    Page <span className="font-semibold text-white">{filters.page}</span>
                  </span>

                  <button
                    onClick={() =>
                      setFilters((p) => ({ ...p, page: p.page + 1 }))
                    }
                    className="px-4 sm:px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm sm:text-base hover:bg-white/10 transition"
                  >
                    Next →
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
