"use client"
import { StatCard } from "@/components/custom/statCard"
import { BookOpen, Clock, Rocket } from "lucide-react"

export default function StudentSummary ( ) {
    const totalTime = "47h 22m";
    const completed = {
        challenges: 24,
        projects: 5,
        journeys: 2,
    }
    return (
      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard
        title="Challenges Completed"
        value={completed.challenges}
        icon={Rocket}
        color="from-orange-500/10 to-pink-500/10"
      />
      <StatCard
        title="Projects Done"
        value={completed.projects}
        icon={BookOpen}
        color="from-emerald-500/10 to-teal-500/10"
      />
      <StatCard
        title="Journeys Progressed"
        value={completed.journeys}
        icon={Clock}
        color="from-cyan-500/10 to-blue-500/10"
      />
      <StatCard
        title="Total Learning Time"
        value={totalTime}
        icon={Clock}
        color="from-fuchsia-500/10 to-rose-500/10"
      />
    </section>
    )
}