'use client'
import React from 'react'

export default function CodeBootcampHero() {
  return (
    <div className="relative pt-9 min-h-screen bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-200">

      {/* Hero Section */}
      <main className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
            <div className="mb-3">
              <span className="text-black">Creator-led </span>
              <span className="bg-black text-white px-4 py-2 rounded-lg italic transform -rotate-1 inline-block">
                coding bootcamp
              </span>
            </div>
            <div className="mb-3">
              <span className="text-black">with </span>
              <span className="underline underline-offset-8 decoration-4 decoration-black">1-to-1 mentoring</span>
              <span className="ml-3 text-4xl">🎓</span>
            </div>
            <div>
              <span className="text-black">study support, projects, </span>
              <span className="text-black italic">and real accountability</span>
            </div>
          </h1>

          <p className="text-lg md:text-2xl text-gray-800 max-w-3xl mx-auto mb-8 leading-relaxed">
            Not a corporate bootcamp. No hype, no guarantees—just a clear roadmap,
            weekly 1-to-1 calls, and hands-on feedback to help you actually learn
            to build things. Flexible, human, and tailored to you.
          </p>

          {/* Soft disclaimer */}
          <p className="text-sm text-gray-700 max-w-xl mx-auto mb-10">
            <span className="font-semibold">Transparency:</span> we don’t promise jobs. We promise structure,
            guidance, and measurable progress through real projects.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="Book a free intro call"
            >
              Book a Free 20-min Intro Call
            </button>
            <button
              className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300"
              aria-label="View sample study plan"
            >
              View Sample Study Plan
            </button>
          </div>

          {/* What you get (replaces job stats) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-left shadow-sm">
              <div className="text-2xl font-bold text-black mb-2">1-to-1 Mentoring</div>
              <p className="text-gray-700">
                Weekly live sessions, async code reviews, and answers to the questions
                you can’t ask in big cohorts.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-left shadow-sm">
              <div className="text-2xl font-bold text-black mb-2">Project-First Learning</div>
              <p className="text-gray-700">
                Build portfolio-ready apps with guided milestones, PR reviews, and
                real-world workflows.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-left shadow-sm">
              <div className="text-2xl font-bold text-black mb-2">Flexible & Supportive</div>
              <p className="text-gray-700">
                Study plan tailored to your schedule. Clear goals, check-ins, and
                accountability without the pressure.
              </p>
            </div>
          </div>

          {/* Optional cohort note */}
          <div className="mt-8 text-sm text-gray-800">
            Next start window: <span className="font-semibold">Rolling</span> — limited spots to keep it personal.
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-8 h-8 bg-white/30 rounded-full animate-bounce"></div>
      <div className="pointer-events-none absolute bottom-1/4 left-1/3 w-12 h-12 bg-white/25 rounded-full animate-pulse"></div>
    </div>
  )
}
