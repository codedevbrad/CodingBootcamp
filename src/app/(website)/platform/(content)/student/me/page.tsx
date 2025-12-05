"use server"

import GreetingToStudent from "@/app/(website)/platform/lib/personalisation/greeting"
import KeepGoing from "@/app/(website)/platform/lib/navigation/keepGoing"
import StudentActivity from "../engagement/student.activity"
import StudentFullProfile from "../profile/_components/profile.card/student.profile"
import StudentSummary from "../engagement/student.summary"

export default async function StudentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white">
      <main className="max-w-6xl mx-auto px-6 py-20 space-y-14">
        <GreetingToStudent />
        <StudentFullProfile />
        <StudentSummary />
        <StudentActivity />
        <KeepGoing />
      </main>
    </div>
  )
}