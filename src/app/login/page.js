'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({});
  const [resetSent, setResetSent] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // Standard login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setError('');
    try {
      // Redirect to Google OAuth or implement OAuth flow
      // For now, show a notification
      setError('Google login will be available soon. Please use email/password login.');
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleGithubLogin = async () => {
    setSocialLoading(prev => ({ ...prev, github: true }));
    setError('');
    try {
      // Redirect to GitHub OAuth or implement OAuth flow
      // For now, show a notification
      setError('GitHub login will be available soon. Please use email/password login.');
    } finally {
      setSocialLoading(prev => ({ ...prev, github: false }));
    }
  };

  const handleLinkedInLogin = async () => {
    setSocialLoading(prev => ({ ...prev, linkedin: true }));
    setError('');
    try {
      // Redirect to LinkedIn OAuth
      setError('LinkedIn login will be available soon. Please use email/password login.');
    } finally {
      setSocialLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setError('');

    try {
      // TODO: Call forgot password API endpoint
      // await forgotPasswordService.sendResetLink(forgotEmail);
      setResetSent(true);
      setSuccessMessage(`Password reset link sent to ${forgotEmail}`);
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setForgotEmail('');
        setResetSent(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setForgotLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    // Removed auto-fill of email for security
    // Users will need to enter email and password each time
  }, []);

  return (
    <div className="min-h-screen ai-bg flex items-center justify-center px-4 sm:px-6 py-10 sm:py-20">
      <div className="glass w-full max-w-md p-6 sm:p-8 lg:p-10">
        
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Welcome back
        </h2>

        <p className="text-center muted mb-6 sm:mb-8 text-sm sm:text-base">
          Sign in to your account
        </p>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 text-red-400 text-xs sm:text-sm border border-red-400/20 flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 rounded-lg bg-green-500/10 text-green-400 text-xs sm:text-sm border border-green-400/20 flex items-start gap-2">
            <span className="mt-0.5">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mb-6">
          
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 text-sm sm:text-base transition"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 text-sm sm:text-base transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-lg text-indigo-400 hover:text-indigo-300 transition"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-white/10 border border-white/20 cursor-pointer accent-indigo-500"
              />
              <span className="muted">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold disabled:opacity-50 text-sm sm:text-base text-white"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={socialLoading.google}
            className="w-full py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {socialLoading.google ? (
              <>
                <span className="animate-spin">⏳</span> Connecting...
              </>
            ) : (
              <>
                <span>🔵</span> Continue with Google
              </>
            )}
          </button>

          {/* GitHub Login */}
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={socialLoading.github}
            className="w-full py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {socialLoading.github ? (
              <>
                <span className="animate-spin">⏳</span> Connecting...
              </>
            ) : (
              <>
                <span>⚫</span> Continue with GitHub
              </>
            )}
          </button>

          {/* LinkedIn Login */}
          <button
            type="button"
            onClick={handleLinkedInLogin}
            disabled={socialLoading.linkedin}
            className="w-full py-2 sm:py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {socialLoading.linkedin ? (
              <>
                <span className="animate-spin">⏳</span> Connecting...
              </>
            ) : (
              <>
                <span>🔗</span> Continue with LinkedIn
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm muted mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
            Create one
          </Link>
        </p>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-500 mt-4">
          By signing in, you agree to our{' '}
          <Link href="#" className="text-indigo-400 hover:text-indigo-300">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="#" className="text-indigo-400 hover:text-indigo-300">
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="glass w-full max-w-md p-6 sm:p-8">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl sm:text-2xl font-bold">Reset Password</h3>
              <button
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setForgotEmail('');
                  setResetSent(false);
                  setError('');
                }}
                className="text-2xl text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {resetSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📧</div>
                <h4 className="text-lg font-semibold mb-2">Check your email</h4>
                <p className="text-sm text-gray-400 mb-4">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-xs text-gray-500">
                  Didn't receive it? Check your spam folder or try again in a few moments.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 text-sm"
                  />

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-xs border border-red-400/20">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(false);
                        setForgotEmail('');
                        setResetSent(false);
                        setError('');
                      }}
                      className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition font-medium text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium text-sm disabled:opacity-50"
                    >
                      {forgotLoading ? 'Sending...' : 'Send Link'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
