"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Rocket,
  Map,
  Award,
  Clock,
  Sparkles,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 🧠 Example student data (replace later with DB fetch)
const student = {
  name: "Sarah Thompson",
  level: "Intermediate",
  joined: "2024-03-15",
  bio: "Frontend-focused developer passionate about building interactive learning tools and scalable web apps. Loves React, design systems, and mentoring new learners.",
  location: "Manchester, UK",
  skills: ["React", "TypeScript", "Next.js", "Tailwind", "Node.js"],
  goals:
    "Become a full-stack engineer and contribute to open-source projects by the end of the year.",
  totalTime: "47h 22m",
  streak: 12,
  completed: {
    challenges: 24,
    projects: 5,
    journeys: 2,
  },
};

const recentActivity = [
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
];

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white">
      <main className="max-w-6xl mx-auto px-6 py-20 space-y-14">

        {/* 👋 Personalized Greeting */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
                Welcome back, {student.name.split(" ")[0]} 👋
              </h1>
              <p className="text-gray-500 mt-2">
                You’re doing amazing! Let’s see how your learning journey’s going.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-700 font-medium shadow-sm cursor-pointer"
            >
              View Progress →
            </motion.div>
          </div>
        </section>

        {/* 👤 Student Profile Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border-slate-200 bg-gradient-to-br from-fuchsia-50/70 to-rose-50/70 p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-2xl font-semibold text-gray-800">{student.name}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{student.bio}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {student.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-700 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-gray-500 text-sm mt-3">
                <span className="font-medium text-gray-700">Goals:</span>{" "}
                {student.goals}
              </p>
            </div>

            <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-slate-100 w-full md:w-64 text-sm space-y-2">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Level:</span> {student.level}
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Joined:</span>{" "}
                {new Date(student.joined).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Location:</span> {student.location}
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

        {/* 📊 Stats Summary */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Challenges Completed"
            value={student.completed.challenges}
            icon={Rocket}
            color="from-orange-500/10 to-pink-500/10"
          />
          <StatCard
            title="Projects Done"
            value={student.completed.projects}
            icon={BookOpen}
            color="from-emerald-500/10 to-teal-500/10"
          />
          <StatCard
            title="Journeys Progressed"
            value={student.completed.journeys}
            icon={Map}
            color="from-cyan-500/10 to-blue-500/10"
          />
          <StatCard
            title="Total Learning Time"
            value={student.totalTime}
            icon={Clock}
            color="from-fuchsia-500/10 to-rose-500/10"
          />
        </section>

        {/* 🧩 Recent Activity */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-100 to-rose-100 text-sm text-fuchsia-700 font-medium">
              <Sparkles className="h-4 w-4 text-fuchsia-600" />
              Recent Activity
            </div>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">
              Keep the Momentum Going 🚀
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Here’s what you’ve been up to lately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentActivity.map((item, i) => {
              return (
                 <ActivityCard
                    key={ i }
                    title={ item.title }
                    description={ item.description }
                    icon={ item.icon }
                    color={ item.color } 
                 />
              );
            })}
          </div>
        </section>

        {/* 🏅 Achievements / Streaks */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-sm text-amber-700 font-medium">
              <Award className="h-4 w-4 text-amber-600" />
              Achievements
            </div>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">
              Your Progress So Far
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

        {/* 💬 Footer */}
        <section className="text-center mt-20 space-y-3">
          <h3 className="text-2xl font-semibold text-gray-800">
            Keep growing, {student.name.split(" ")[0]}!
          </h3>
          <p className="text-gray-500">
            Explore more{" "}
            <span className="font-medium text-fuchsia-600">Challenges</span> or{" "}
            <span className="font-medium text-cyan-600">Journeys</span> to stay on
            track.
          </p>
        </section>
      </main>
    </div>
  );
}

/* 📊 Reusable stat card component */
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={cn(
        "rounded-2xl p-5 bg-gradient-to-br  hover:shadow-md transition",
        color
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <Icon className="h-7 w-7 text-gray-700 opacity-70" />
      </div>
    </motion.div>
  );
}

/* 🏅 Achievement card */
function ActivityCard({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={cn(
        "rounded-2xl p-6 bg-gradient-to-br hover:shadow-md transition",
        color
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-amber-600" />
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      </div>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
}
