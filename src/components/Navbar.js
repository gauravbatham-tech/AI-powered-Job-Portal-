'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/recruitx-logo.svg"
            alt="RecruitX"
            width={28}
            height={28}
            priority
          />
          <span className="text-xl font-extrabold tracking-tight gradient-text">
            RecruitX
          </span>
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-6 text-sm">

          {!user && (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition">
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
                AI Score
                <span className="text-white font-bold">78%</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>

                  <span className="hidden sm:block text-gray-200">
                    {user.firstName}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-48 glass p-2 text-sm">
                    <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-white/10">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-3 py-2 rounded-lg hover:bg-white/10">
                      Profile
                    </Link>
                    <Link href="/applications" className="block px-3 py-2 rounded-lg hover:bg-white/10">
                      Applications
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400"
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
    </nav>
  );
}
