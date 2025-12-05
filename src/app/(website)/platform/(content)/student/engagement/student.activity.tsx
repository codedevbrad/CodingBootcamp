"use client"

import { ActivityCard } from "@/components/custom/activityCard"
import {
  BookOpen, Rocket, Map, Award, Sparkles, CheckCircle , Lightbulb, LucideIcon
} from "lucide-react"


const recentActivity: {
  type: "challenge" | "journey" | "project"
  title: string
  description: string
  color: string
  icon: LucideIcon
}[] = [
  {
    type: "challenge",
    title: "React Props Mastery",
    description: "You passed all tests in the React Props Challenge!",
    color: "from-orange-500/10 to-pink-500/10",
    icon: Rocket,
  },
  {
    type: "journey",
    title: "Frontend Fundamentals",
    description: "You reached step 3: Component Architecture.",
    color: "from-cyan-500/10 to-blue-500/10",
    icon: Map,
  },
  {
    type: "project",
    title: "Task Manager App",
    description: "You completed your first full CRUD project!",
    color: "from-emerald-500/10 to-teal-500/10",
    icon: BookOpen,
  },
]

export default function StudentActivity ( ) {

  return (
    <>
      {/* 🧩 Recent Activity */}
      <section className="mt-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-100 to-rose-100 text-sm text-fuchsia-700 font-medium">
            <Sparkles className="h-4 w-4 text-fuchsia-600" />
            Recent Activity
          </div>
          <h2 className="text-3xl font-bold mt-4 text-gray-800">
            Keep the momentum going 🚀
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Here’s what you’ve been up to lately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentActivity.map((item) => (
            <ActivityCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>
      </section>

      {/* 🏅 Achievements / Streaks */}
      <section className="mt-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-sm text-amber-700 font-medium">
            <Award className="h-4 w-4 text-amber-600" />
            Achievements
          </div>
          <h2 className="text-3xl font-bold mt-4 text-gray-800">
            Your progress so far
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActivityCard
            title="🔥 12-Day Streak!"
            description="You’ve been learning every day for almost two weeks. Keep it going!"
            icon={CheckCircle}
            color="from-orange-400/20 to-pink-400/20"
          />
          <ActivityCard
            title="🏆 Level Up: Intermediate"
            description="You’ve completed enough challenges to reach the Intermediate tier!"
            icon={Award}
            color="from-emerald-400/20 to-teal-400/20"
          />
          <ActivityCard
            title="💡 5 Projects Finished"
            description="You’re becoming a full-stack problem solver."
            icon={Lightbulb}
            color="from-blue-400/20 to-cyan-400/20"
          />
        </div>
      </section>
    </>
  )
}
