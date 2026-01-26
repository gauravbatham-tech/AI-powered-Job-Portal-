'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'candidate',
    companyName: '',
    industry: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ai-bg flex items-center justify-center px-4 sm:px-6 py-10 sm:py-20">

      <div className="glass w-full max-w-md p-6 sm:p-8 lg:p-10">

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Create account
        </h2>

        <p className="text-center muted mb-6 sm:mb-8 text-sm sm:text-base">
          Start your AI-powered career journey
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-400/20 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <input
              name="firstName"
              placeholder="First name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
            />

            <input
              name="lastName"
              placeholder="Last name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 pr-12 sm:pr-20 rounded-xl focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-indigo-400 hover:text-indigo-300"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          {formData.role === 'recruiter' && (
            <>
              <input
                name="companyName"
                placeholder="Company name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />

              <input
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
