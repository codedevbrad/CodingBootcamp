"use server"

import { PlatformSectionsGrid } from "@/app/(website)/platform/lib/navigation/content.as.blocks"
import StartHere from "@/app/(website)/platform/lib/navigation/firstSteps/starthere"
import GreetingToStudent from "@/app/(website)/platform/lib/personalisation/greeting"
import GuestOnboarding from "@/app/features/user/guest/_components/quest.onboard"

export default async function PlatformHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white">
        <main className="max-w-6xl mx-auto px-6 py-20 space-y-14">
          <GreetingToStudent />
          <GuestOnboarding />
          <PlatformSectionsGrid />
          <StartHere />
        </main>
      </div>
  )
}