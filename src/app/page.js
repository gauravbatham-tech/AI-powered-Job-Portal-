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

{/* ===== HERO SECTION ===== */}
<section className="relative overflow-hidden bg-white dark:bg-transparent">

  {/* Dark mode gradient ONLY */}
  <div className="
    absolute inset-0 hidden dark:block
     bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-700
  " />

  {/* Dark overlay */}
  <div className="absolute inset-0 hidden dark:block bg-black/10"></div>

  <div className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 lg:py-32 text-center max-w-6xl mx-auto">

    {/* Badge */}
    <div className="mb-6 sm:mb-8 inline-block">
      <span className="
        px-4 py-2 rounded-full text-xs sm:text-sm font-semibold
        bg-indigo-100 text-indigo-700 border border-indigo-200
        dark:bg-white/10 dark:text-white dark:border-white/20
      ">
        ✨ Powered by Advanced AI
      </span>
    </div>

    {/* Heading */}
    <h1 className="
      text-3xl sm:text-4xl lg:text-5xl xl:text-6xl
      font-extrabold leading-tight mb-4 sm:mb-6
      text-gray-900 dark:text-white
    ">
      Jobs shouldn’t be guessed.
      <br className="hidden sm:block" />
      <span className="text-indigo-600 dark:text-indigo-200">
        They should be predicted.
      </span>
    </h1>

    {/* Subtitle */}
    <p className="
      text-base sm:text-lg lg:text-xl
      text-gray-600 dark:text-indigo-100
      max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed
    ">
      Our AI understands your resume and surfaces opportunities where you
      actually have a real chance — before you waste time applying.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10">

      {/* Primary CTA */}
      <Link
        href="/register"
        className="
          px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold
          border border-indigo-300 text-indigo-700 hover:bg-indigo-50
          transition
          dark:border-white/30 dark:text-white
          dark:hover:bg-white dark:hover:text-indigo-700
        "
      >
        Let AI Analyze You
      </Link>

      {/* Secondary CTA */}
      <Link
        href="/jobs"
        className="
          px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold
          border border-indigo-300 text-indigo-700 hover:bg-indigo-50
          transition
          dark:border-white/30 dark:text-white
          dark:hover:bg-white dark:hover:text-indigo-700
        "
      >
        Explore Smart Jobs
      </Link>
    </div>

    {/* Feature Grid */}
    <div className="
      mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm
      text-gray-700 dark:text-indigo-100
    ">
      {[
        "🧠 Resume Intelligence",
        "🎯 Match Score",
        "📊 Skill Gap AI",
        "🚀 Career Mapping",
      ].map((item) => (
        <div
          key={item}
          className="
            p-3 rounded-lg
            bg-white border border-gray-200 shadow-sm
            dark:bg-white/10 dark:border-white/20 dark:shadow-none
            backdrop-blur
          "
        >
          {item}
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16">
            Making Impact with AI
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '50K+', label: 'Jobs Matched' },
              { number: '85%', label: 'Success Rate' },
              { number: '24/7', label: 'AI Support' },
            ].map((stat, i) => (
              <div key={i} className="glass glass-hover p-6 sm:p-8 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2">{stat.number}</div>
                <div className="muted text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto glass p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
            The Problem with Traditional Job Search
          </h2>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-left muted text-sm sm:text-base mb-8">
            <div className="flex gap-3 items-start">
              <span className="text-xl">❌</span>
              <div>100 applications. Zero replies.</div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">❌</span>
              <div>No idea why you're rejected.</div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">❌</span>
              <div>Same resume everywhere. No personalization.</div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">❌</span>
              <div>Keyword-based matching is fake and ineffective.</div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">❌</span>
              <div>Skill gaps identified too late.</div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">❌</span>
              <div>No career path guidance or mentorship.</div>
            </div>
          </div>

          <div className="bg-gradient-to-red from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 p-6 rounded-lg text-center">
            <p className="text-indigo-500 font-semibold text-base sm:text-lg">
              This isn't another job portal. It's an AI-powered career decision engine.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CORE FEATURES ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16">
            Powerful AI Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              ['🧠 Resume Intelligence', 'Advanced NLP analyzes your resume beyond keywords to understand your true capabilities and experience depth.'],
              ['🎯 Match Probability', 'Know your chances before applying. See exact fit percentages based on job requirements vs your skills.'],
              ['📊 Skill Gap Analysis', 'Identify missing skills with clear roadmaps. Get personalized recommendations for skill development.'],
              ['🚀 Career Direction', 'Discover your career trajectory. AI suggests growth paths and related opportunities aligned with your goals.'],
              ['💼 Profile Optimization', 'AI suggests how to improve your profile for better matches. Real-time feedback and recommendations.'],
              ['🔔 Smart Notifications', 'Get alerts for jobs that match YOU, not just keywords. Reduce noise with intelligent filtering.'],
              ['📈 Analytics Dashboard', 'Track application performance. See trends, success rates, and insights across your job search.'],
              ['🤖 AI Interviewer', 'Practice interviews with AI. Get feedback on answers, communication, and interview readiness.'],
            ].map(([title, desc]) => (
              <div key={title} className="glass glass-hover p-6 sm:p-8 hover:border-indigo-400/50 transition duration-300">
                <h3 className="font-bold text-base sm:text-lg mb-3">{title}</h3>
                <p className="muted text-xs sm:text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16">
            How It Works
          </h2>

          <div className="glass p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-10">
            {[
              { step: 1, title: 'Upload Your Resume', desc: 'Simply upload your resume. Our AI instantly extracts and analyzes all relevant information.' },
              { step: 2, title: 'AI Analysis Complete', desc: 'System analyzes your skills, experience, certifications, and career trajectory with precision.' },
              { step: 3, title: 'Smart Job Discovery', desc: 'See only relevant opportunities tailored to your profile. High-match jobs appear first.' },
              { step: 4, title: 'Apply with Confidence', desc: 'Apply to jobs knowing your fit score. Get insights on what to highlight in your application.' },
              { step: 5, title: 'Track & Improve', desc: 'Monitor your applications and success rates. Receive actionable feedback to improve.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 sm:gap-6 items-start pb-6 sm:pb-8 border-b border-white/10 last:border-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-brown from-indigo-600 to-purple-600 flex items-center justify-center font-bold flex-shrink-0 text-base sm:text-lg shadow-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                  <p className="muted text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16">
            Perfect for Every Career Stage
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: '🎓',
                title: 'Fresh Graduates',
                desc: 'Starting your career? Find entry-level opportunities that match your education and potential.'
              },
              {
                icon: '📈',
                title: 'Career Changers',
                desc: 'Switching fields? AI identifies transferable skills and suitable opportunities in new industries.'
              },
              {
                icon: '⭐',
                title: 'Experienced Professionals',
                desc: 'Advance your career. Find senior roles, leadership positions, and domain-specific opportunities.'
              },
              {
                icon: '🚀',
                title: 'Freelancers & Consultants',
                desc: 'Looking for project-based work? Discover contract opportunities matching your expertise.'
              },
              {
                icon: '🌍',
                title: 'Remote Workers',
                desc: 'Work from anywhere. Filter jobs by remote options, timezone, and work flexibility.'
              },
              {
                icon: '💡',
                title: 'Skill Builders',
                desc: 'Developing new skills? Find opportunities that help you grow and learn on the job.'
              },
            ].map((useCase, i) => (
              <div key={i} className="glass glass-hover p-6 sm:p-8">
                <div className="text-4xl mb-3">{useCase.icon}</div>
                <h3 className="font-bold text-base sm:text-lg mb-2">{useCase.title}</h3>
                <p className="muted text-xs sm:text-sm leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING PREVIEW ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center muted mb-12 sm:mb-16 text-sm sm:text-base">
            Start free. Upgrade anytime. No hidden fees.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['Upload resume', 'AI Analysis', 'Job browsing', 'Basic matching', 'Limited applications']
              },
              {
                name: 'Professional',
                price: '$9.99',
                features: ['Unlimited applications', 'Skill gap analysis', 'Smart notifications', 'Career insights', 'Priority support'],
                highlighted: true
              },
              {
                name: 'Premium',
                price: '$19.99',
                features: ['Everything in Pro', 'AI interview coach', 'Resume optimization', 'Career mentor access', '1-on-1 guidance']
              },
            ].map((plan, i) => (
              <div key={i} className={`glass p-6 sm:p-8 ${plan.highlighted ? 'border-2 border-indigo-500' : ''}`}>
                {plan.highlighted && <div className="mb-4 text-center text-indigo-400 text-xs font-bold">MOST POPULAR</div>}
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-indigo-400 mb-4">{plan.price}<span className="text-sm text-gray-400">/mo</span></div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-xs sm:text-sm muted flex gap-2 items-start">
                      <span>✓</span> <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-sm ${plan.highlighted
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'How does the AI match jobs to my profile?',
                a: 'Our AI uses advanced NLP and machine learning to analyze your resume, skills, and experience, then matches them against job requirements using contextual understanding rather than simple keyword matching.'
              },
              {
                q: 'Is my resume data secure and private?',
                a: 'Absolutely. Your data is encrypted, never shared with third parties, and used solely for improving job matches. We comply with all data protection regulations.'
              },
              {
                q: 'Can I use this for career transitions?',
                a: 'Yes! The AI is specifically designed to help career changers by identifying transferable skills and finding opportunities that leverage your unique background.'
              },
              {
                q: 'How often are new jobs added?',
                a: 'We aggregate jobs from 100+ sources and update our database hourly, ensuring you always see the latest opportunities.'
              },
              {
                q: 'What if I disagree with the match score?',
                a: 'You can provide feedback on matches, and our AI learns from your input to improve future recommendations.'
              },
              {
                q: 'Is there a mobile app available?',
                a: 'Our platform is fully responsive and works great on mobile. A dedicated iOS/Android app is coming soon!'
              },
            ].map((item, i) => (
              <details key={i} className="glass p-4 sm:p-6 group cursor-pointer">
                <summary className="font-semibold text-base sm:text-lg flex justify-between items-center">
                  {item.q}
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="muted text-sm sm:text-base mt-4 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto glass p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
            Why Choose Our Platform?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              { icon: '🤖', title: 'AI-Powered', desc: 'Advanced machine learning understands you better than keyword matching ever could.' },
              { icon: '⚡', title: 'Save Time', desc: 'Reduce application time by 70%. Focus on opportunities where you truly fit.' },
              { icon: '📊', title: 'Data-Driven', desc: 'Every recommendation backed by analytics and proven success metrics.' },
              { icon: '🎯', title: 'Accuracy', desc: '85% of our users land interviews within the first 10 applications.' },
              { icon: '🌐', title: 'Global Reach', desc: 'Access jobs from companies worldwide across diverse industries.' },
              { icon: '🚀', title: 'Continuous Growth', desc: 'Regular features, improvements, and AI model updates for better results.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="text-3xl flex-shrink- 0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-1">{item.title}</h3>
                  <p className="muted text-xs sm:text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 sm:py-24 lg:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-brown from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed">
            Join thousands of professionals finding their perfect role with AI-powered matching.
            Start your journey today — it's completely free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-gray-100 transition text-sm sm:text-base shadow-lg"
            >
              Get Started for Free
            </Link>

            <Link
              href="/jobs"
              className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-gray-100 transition text-sm sm:text-base shadow-lg"
            >
              Browse Jobs Now
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-indigo-600 mt-6">
            No credit card required • Free AI analysis • Cancel anytime
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/10 bg-indigo-600">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div> <h3 className="font-bold mb-3 sm:mb-4 text-white">Product</h3>
            <ul className="space-y-2 muted text-xs sm:text-sm">
              <li><Link href="#" className="hover:text-white text-white/75">Features</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">How It Works</Link></li>
            </ul> </div> <div> <h3 className="font-bold mb-3 sm:mb-4 text-white">Company</h3>
            <ul className="space-y-2 muted text-xs sm:text-sm">
              <li><Link href="#" className="hover:text-white text-white/75">About Us</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">Blog</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">Careers</Link></li>
            </ul> </div> <div> <h3 className="font-bold mb-3 sm:mb-4 text-white">Resources</h3>
            <ul className="space-y-2 muted text-xs sm:text-sm">
              <li><Link href="#" className="hover:text-white text-white/75">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">API Reference</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">Support</Link></li>
            </ul> </div>
          <div> <h3 className="font-bold mb-3 sm:mb-4 text-white">Legal</h3>
            <ul className="space-y-2 muted text-xs sm:text-sm">
              <li><Link href="#" className="hover:text-white text-white/75">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white text-white/75">Contact</Link></li> </ul> </div>
        </div> <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 text-center muted text-xs">
          <p className='text-white'>© 2026 AI Job Portal. All rights reserved. Powered by Advanced AI & Machine Learning.</p>
        </div>
      </section>


    </div>
  );
}
