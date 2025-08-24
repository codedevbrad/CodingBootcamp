// src/app/tutorHub/layout.tsx
import type { Metadata } from "next"
import { requireTutor } from "@/lib/auth/auth.requirerole"
import TutorHubHeader from "./(layout)/header/header"

export const metadata: Metadata = {
  title: "TutorHub - The Code Bootcamp",
  description: "Tutor Dashboard - Learning Application",
}

export default async function TutorHubLayout({ children }: { children: React.ReactNode }) {
  const { tutor } = await requireTutor("/tutorHub") // returns { session, tutor }

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHubHeader tutor={tutor} tutorProfile={tutor.tutorProfile} />
      <div>{children}</div>
    </div>
  )
}
