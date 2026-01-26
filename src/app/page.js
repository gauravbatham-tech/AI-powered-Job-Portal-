'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <div className="min-h-screen ai-bg">

      {/* HERO */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 lg:py-32 text-center max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 sm:mb-6">
          Jobs shouldn't be guessed. <br className="hidden sm:block" />
          <span className="gradient-text">They should be predicted.</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl muted max-w-3xl mx-auto mb-6 sm:mb-10 px-2">
          Our AI reads your resume, understands your skills, and shows jobs where you
          actually have a chance — before you waste time applying.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 sm:px-10 py-3 sm:py-4 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-800 transition text-sm sm:text-base"
          >
            Let AI Analyze You 
          </Link>

          <Link
            href="/jobs"
            className="px-6 sm:px-10 py-3 sm:py-4 border border-indigo-400 text-indigo-300 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition text-sm sm:text-base"
          >
            Explore Smart Jobs
          </Link>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs sm:text-sm muted">
          <div>🧠 Resume Intelligence</div>
          <div>🎯 Match Score</div>
          <div>📊 Skill Gap AI</div>
          <div>🚀 Career Mapping</div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto glass p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
            The job system is broken.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-left muted text-sm sm:text-base">
            <div>❌ 100 applications. Zero replies.</div>
            <div>❌ No idea why you're rejected.</div>
            <div>❌ Same resume everywhere.</div>
            <div>❌ Keyword-based fake matching.</div>
          </div>

          <p className="mt-8 sm:mt-12 text-center text-indigo-400 font-semibold text-base sm:text-lg lg:text-xl">
            This isn't another job portal.  
            It's an AI career decision engine.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            ['🧠 Resume Intelligence', 'Understands context, not keywords.'],
            ['🎯 Fit Probability', 'Know your chances before applying.'],
            ['📊 Skill Gap AI', "See what's missing clearly."],
            ['🚀 Career Direction', "Discover what role you're growing into."],
          ].map(([title, desc]) => (
            <div key={title} className="glass glass-hover p-6 sm:p-8">
              <h3 className="font-bold text-base sm:text-lg mb-2">{title}</h3>
              <p className="muted text-xs sm:text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto glass p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10">
            How it works
          </h2>

          {[
            'Upload resume — AI builds your profile.',
            'System analyzes skills and experience.',
            'You see only relevant opportunities.',
            'Apply with confidence — no guessing.',
          ].map((text, i) => (
            <div key={i} className="flex gap-4 sm:gap-6 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">
                {i + 1}
              </div>
              <p className="text-sm sm:text-base lg:text-lg muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 lg:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 opacity-90"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Stop chasing jobs.
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10">
            Let your skills attract the right ones.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-gray-300 transition text-sm sm:text-base"
            >
              Start Free With AI
            </Link>

            <Link
              href="/jobs"
              className="px-6 sm:px-10 py-3 sm:py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-500 transition text-sm sm:text-base"
            >
              View Smart Jobs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
