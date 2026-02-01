'use client';

import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  
  let theme = 'system';
  let toggleTheme = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (e) {
    // Theme context not available yet
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-white/10 transition"
        disabled
      >
        <span className="text-lg">⚙️</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setThemeMenuOpen(!themeMenuOpen)}
        className="p-2 rounded-lg hover:bg-white/10 transition"
        title="Toggle theme"
      >
        {theme === 'light' && <span className="text-lg">☀️</span>}
        {theme === 'dark' && <span className="text-lg">🌙</span>}
        {theme === 'system' && <span className="text-lg">💻</span>}
      </button>

      {themeMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 glass p-2 text-sm z-50 rounded-lg">
          <button
            onClick={() => {
              toggleTheme('light');
              setThemeMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
              theme === 'light' ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/10'
            }`}
          >
            <span>☀️</span> Light Mode
          </button>
          <button
            onClick={() => {
              toggleTheme('dark');
              setThemeMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
              theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/10'
            }`}
          >
            <span>🌙</span> Dark Mode
          </button>
          <button
            onClick={() => {
              toggleTheme('system');
              setThemeMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
              theme === 'system' ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/10'
            }`}
          >
            <span>💻</span> System Default
          </button>
        </div>
      )}
    </div>
  );
}
