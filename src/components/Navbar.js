'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">

      {/* Gradient background */}
      <div className="absolute inset-0 bg-indigo-600"></div>
      <div className="absolute inset-0 bg-gradient-to-red from-indigo-600 via-purple-600 to-pink-600 opacity-80"></div>
      <div className="absolute inset-0 backdrop-blur-xl"></div>

      {/* Content */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/recruitx-logo.svg"
              alt="RecruitX"
              width={28}
              height={28}
              priority
            />
            <span className="text-xl font-extrabold text-white">
              RecruitX
            </span>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-3 text-white">

            {/* THEME SWITCH */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                {theme === 'light' && '☀️'}
                {theme === 'dark' && '🌙'}
                {theme === 'system' && '💻'}
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 glass p-2 rounded-lg">
                  <button onClick={() => setTheme('light')} className="block w-full px-3 py-2 text-left hover:bg-white/10 rounded">☀️ Light</button>
                  <button onClick={() => setTheme('dark')} className="block w-full px-3 py-2 text-left hover:bg-white/10 rounded">🌙 Dark</button>
                  <button onClick={() => setTheme('system')} className="block w-full px-3 py-2 text-left hover:bg-white/10 rounded">💻 System</button>
                </div>
              )}
            </div>

            {!user && (
              <>
                <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-gray-100 transition"
                >
                  Get Started
                </Link>
              </>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-indigo-700 flex items-center justify-center font-bold">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.firstName}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass p-2 rounded-lg">
                    <Link href="/dashboard" className="block px-3 py-2 hover:bg-white/10 rounded">Dashboard</Link>
                    <Link href="/profile" className="block px-3 py-2 hover:bg-white/10 rounded">Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-400 rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
