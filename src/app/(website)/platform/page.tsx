"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  PlusCircle,
  BookOpen,
  Layers,
  Rocket,
  Map,
  Sparkles,
  Lightbulb,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = {
  create: {
    title: "Create",
    description: "Practice creating System Design and ERM diagrams.",
    href: "/platform/create",
    color: "from-fuchsia-500/10 to-rose-500/10",
    icon: PlusCircle,
  },
  concepts: {
    title: "Concepts",
    description:
      "Master theory with bite-sized interactive explanations and examples.",
    href: "/platform/concepts",
    color: "from-blue-500/10 to-purple-500/10",
    icon: BookOpen,
  },
  projects: {
    title: "Projects",
    description:
      "Build real-world projects and showcase your progress through code.",
    href: "/platform/projects",
    color: "from-emerald-500/10 to-teal-500/10",
    icon: Layers,
  },
  challenges: {
    title: "Challenges",
    description: "Sharpen your skills with coding puzzles and real-time grading.",
    href: "/platform/challenges",
    color: "from-orange-500/10 to-pink-500/10",
    icon: Rocket,
  },
  journeys: {
    title: "Journeys",
    description:
      "Follow guided learning paths from beginner to pro, step by step.",
    href: "/platform/journeys",
    color: "from-cyan-500/10 to-blue-500/10",
    icon: Map,
  },
};

// 🧠 Example personalized data (you could replace this with real user data)
const featured = {
  challenge: {
    title: "React State Logic Challenge",
    description: "Test your ability to manage state effectively in a React component.",
    href: "/platform/challenges/react/state-logic",
    icon: Rocket,
    color: "from-orange-400/20 to-pink-400/20",
  },
  tip: {
    title: "Use the Platform Efficiently",
    description:
      "Track your progress in 'Journeys' — everything is structured by skill level, so you always know what’s next.",
    icon: Lightbulb,
    color: "from-blue-400/20 to-cyan-400/20",
  },
};

export default function PlatformHome() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white">
      <main className="max-w-6xl mx-auto px-6 py-20 space-y-14">

        {/* 👋 Personalized Greeting */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
                Hey 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Ready to dive back into learning today?
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-700 font-medium shadow-sm cursor-pointer"
            >
              View Progress →
            </motion.div>
          </div>

          {/* ⚡ Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured Challenge */}
            <Link href={featured.challenge.href}>
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className={cn(
                  "rounded-2xl p-6 bg-gradient-to-br border border-slate-200 shadow-sm hover:shadow-md transition",
                  featured.challenge.color
                )}
              >
                <div className="flex items-center gap-3">
                  <featured.challenge.icon className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold text-lg text-gray-800">
                    {featured.challenge.title}
                  </h3>
                </div>
                <p className="mt-2 text-gray-600 text-sm">
                  {featured.challenge.description}
                </p>
                <div className="mt-3 text-sm font-medium text-orange-600">
                  Try Challenge →
                </div>
              </motion.div>
            </Link>

            {/* Platform Tip */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className={cn(
                "rounded-2xl p-6 bg-gradient-to-br border border-slate-200 shadow-sm hover:shadow-md transition",
                featured.tip.color
              )}
            >
              <div className="flex items-center gap-3">
                <featured.tip.icon className="h-6 w-6 text-cyan-600" />
                <h3 className="font-semibold text-lg text-gray-800">
                  {featured.tip.title}
                </h3>
              </div>
              <p className="mt-2 text-gray-600 text-sm">
                {featured.tip.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 🧩 Platform Sections */}
        <section className="pt-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-sm text-blue-700 font-medium">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Explore the Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-800">
              Learn by Doing
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Explore the areas below to create, learn, and grow your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(sections).map(([key, section]) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={key}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={section.href}
                    className={cn(
                      "group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6",
                      "bg-gradient-to-br",
                      section.color
                    )}
                  >
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/70 shadow-sm backdrop-blur-sm">
                          <Icon className="h-6 w-6 text-gray-700 group-hover:text-cyan-600 transition" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {section.title}
                        </h2>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {section.description}
                      </p>

                      <div className="pt-2 text-sm font-medium text-cyan-600 group-hover:text-cyan-700 transition">
                        Explore →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 💬 Footer */}
        <section className="text-center mt-20 space-y-3">
          <h3 className="text-2xl font-semibold text-gray-800">
            Not sure where to start?
          </h3>
          <p className="text-gray-500">
            Try the <span className="font-medium text-blue-600">Journeys</span> section for guided paths, or jump into a{" "}
            <span className="font-medium text-orange-600">Challenge</span> for hands-on learning.
          </p>
        </section>
      </main>
    </div>
  );
}
