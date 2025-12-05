"use client"

import { motion } from "framer-motion"
import type { StudentProfileSummary } from "@/auth"

type Props = {
  student: StudentProfileSummary
}

const PlaceholderText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gray-400 italic text-sm">{children}</span>
)

export default function StudentFullProfileClient({ student }: Props) {
  const hasName = student.name && student.name.trim() !== ""
  const hasBio = student.bio && student.bio.trim() !== ""
  const hasSkills = student.skills && student.skills.length > 0
  const hasGoals = student.goals && student.goals.trim() !== ""
  const hasLocation = student.location && student.location.trim() !== ""

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-fuchsia-50/70 to-rose-50/70 p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-800">
            {hasName ? (
              student.name
            ) : (
              <PlaceholderText>Your name will appear here</PlaceholderText>
            )}
          </h2>
          {hasBio ? (
            <p className="text-gray-600 text-sm leading-relaxed">{student.bio}</p>
          ) : (
            <p className="text-gray-400 italic text-sm leading-relaxed">
              Add a bio to tell others about yourself...
            </p>
          )}

          {hasSkills ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-700 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="pt-2">
              <PlaceholderText>Add your skills to get started</PlaceholderText>
            </div>
          )}

          <p className="text-gray-500 text-sm mt-3">
            <span className="font-medium text-gray-700">Goals:</span>{" "}
            {hasGoals ? (
              student.goals
            ) : (
              <PlaceholderText>What are you working towards?</PlaceholderText>
            )}
          </p>
        </div>

        <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-slate-100 w-full md:w-64 text-sm space-y-2">
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Level:</span> {student.level}
          </div>
          {student.joined && (
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Joined:</span>{" "}
              {new Date(student.joined).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Location:</span>{" "}
            {hasLocation ? (
              student.location
            ) : (
              <PlaceholderText>Not set</PlaceholderText>
            )}
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Streak:</span>{" "}
            <span className="text-fuchsia-600 font-semibold">
              {student.streak} days 🔥
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
