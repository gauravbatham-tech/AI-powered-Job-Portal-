'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Image
            src="/recruitx-logo.svg"
            alt="RecruitX"
            width={28}
            height={28}
            priority
          />
          <span className="text-lg sm:text-xl font-extrabold tracking-tight gradient-text">
            RecruitX
          </span>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">

          {!user && (
            <>
              <Link href="/login" className="px-4 lg:px-5 py-2 rounded-xl text-white font-semibold hover:text-white hover:bg-indigo-700 transition">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 lg:px-5 py-2 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
                AI Score
                <span className="text-white font-bold">78%</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="w-8 lg:w-9 h-8 lg:h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm lg:text-base">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-gray-200">
                    {user.firstName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 glass p-2 text-sm z-50">
                    <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
                      Profile
                    </Link>
                    <Link href="/applications" className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
                      Applications
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {!user && (
              <>
                <Link 
                  href="/login" 
                  className="block px-4 py-2 rounded-lg text-white font-semibold hover:bg-indigo-700 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-700 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}

            {user && (
              <>
                <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/profile" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/applications" className="block px-4 py-2 rounded-lg hover:bg-white/10 transition" onClick={() => setMobileMenuOpen(false)}>
                  Applications
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
