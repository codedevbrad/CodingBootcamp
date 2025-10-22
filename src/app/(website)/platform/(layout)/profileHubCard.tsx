"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GraduationCap, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export default function MyLearningHub() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Tab */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ x: -4 }}
        className="fixed top-30 right-0 z-50 flex items-center gap-2 rounded-l-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-medium px-3 py-2 shadow-lg hover:shadow-xl transition-all"
      >
        <GraduationCap className="h-5 w-5" />
        <span className="hidden md:inline">My Learning Hub</span>
      </motion.button>

      {/* Slide-out Card */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="hub-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className=" fixed h-[50vh] top-29 right-0 w-80 sm:w-96 bg-white/90 backdrop-blur-lg border-l border-slate-200 shadow-2xl z-50 p-6 flex flex-col rounded-l-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-cyan-500" />
                My Learning Hub
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Hub Content */}
            <div className="space-y-4 flex-1">
              <p className="text-gray-600 text-sm leading-relaxed">
                Track your progress, revisit topics, and see what’s next on your learning journey.
              </p>

              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-slate-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  Continue Learning
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Last active: <span className="text-blue-600">Frontend Journey</span>
                </p>
                <Link
                  href="/platform/me"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  Go to Student Hub <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  Tip of the Day 🌱
                </h3>
                <p className="text-sm text-gray-600">
                  Break big goals into smaller milestones — complete one challenge daily to build momentum!
                </p>
              </div>
            </div>

            <footer className="mt-auto text-center text-xs text-gray-400">
              © {new Date().getFullYear()} CodeBootcamp
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
