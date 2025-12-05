"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { sections } from "./navItems"

export function PlatformSectionsGrid() {
  return (
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
          const Icon = section.icon
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
          )
        })}
      </div>
    </section>
  )
}


