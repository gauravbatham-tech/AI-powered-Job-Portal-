'use client';

import { useState } from 'react';
import { jobService } from '@/services';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import { useRouter } from 'next/navigation';

const experienceLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'];
const jobCategories = ['IT', 'Finance', 'Marketing', 'Sales', 'HR', 'Operations', 'Design', 'Data Science', 'Product', 'Engineering'];

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    experienceLevel: '',
    companyName: '',
    salaryMin: '',
    salaryMax: '',
    location: { city: '', state: '', country: '', isRemote: false },
    requiredSkills: [],
    responsibilities: [],
    requirements: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setFormData(p => ({
        ...p,
        location: { ...p.location, [key]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const handleArray = (e, field) => {
    setFormData(p => ({
      ...p,
      [field]: e.target.value.split('\n').filter(Boolean)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await jobService.createJob(formData);
      router.push('/my-jobs');
    } catch {
      setError('Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['recruiter']}>

      <div className="min-h-screen ai-bg px-6 py-12">

        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-10">
            Create Job Posting
          </h1>

          {error && (
            <div className="glass p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* BASIC */}
            <div className="glass p-8 space-y-5">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <input
                name="title"
                placeholder="Job title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none"
              />

              <textarea
                name="description"
                placeholder="Describe the role..."
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
                >
                  <option value="">Category</option>
                  {jobCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
                >
                  <option value="">Experience</option>
                  {experienceLevels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <input
                name="companyName"
                placeholder="Company name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
              />
            </div>

            {/* LOCATION + SALARY */}
            <div className="glass p-8 space-y-5">
              <h2 className="text-xl font-semibold">Location & Salary</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input name="location.city" placeholder="City" onChange={handleChange} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl" />
                <input name="location.state" placeholder="State" onChange={handleChange} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl" />
                <input name="location.country" placeholder="Country" onChange={handleChange} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl" />
              </div>

              <div className="flex items-center gap-2 text-sm muted">
                <input
                  type="checkbox"
                  name="location.isRemote"
                  checked={formData.location.isRemote}
                  onChange={handleChange}
                />
                Remote position
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input name="salaryMin" placeholder="Min salary" onChange={handleChange} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl" />
                <input name="salaryMax" placeholder="Max salary" onChange={handleChange} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl" />
              </div>
            </div>

            {/* REQUIREMENTS */}
            <div className="glass p-8 space-y-5">
              <h2 className="text-xl font-semibold">Requirements</h2>

              <textarea
                rows="3"
                placeholder="Required skills (one per line)"
                onChange={(e) => handleArray(e, 'requiredSkills')}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
              />

              <textarea
                rows="3"
                placeholder="Responsibilities (one per line)"
                onChange={(e) => handleArray(e, 'responsibilities')}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
              />

              <textarea
                rows="3"
                placeholder="Requirements (one per line)"
                onChange={(e) => handleArray(e, 'requirements')}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
              />
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Posting job...' : 'Publish Job'}
            </button>

          </form>
        </div>
      </div>

    </ProtectedRoute>
  );
}
