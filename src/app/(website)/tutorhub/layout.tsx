import type { Metadata } from "next"
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { redirect } from 'next/navigation'
import TutorHubHeader from "./(layout)/header/header"

export const metadata: Metadata = {
  title: "TutorHub - The Code Bootcamp",
  description: "Tutor Dashboard - Learning Application",
}


export default async function TutorHubLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Get current session
  const session = await auth()

  // Check if user is authenticated
  if (!session?.user?.id) {
    redirect('/api/auth/signin?callbackUrl=/tutorHub')
  }

  // Check if user has TUTOR role
  if (session.user.role !== 'TUTOR') {
    redirect('/unauthorized?reason=tutor-access-required')
  }

  // Get full tutor data with profile
  const tutor = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tutorProfile: true,
      accounts: true,
    }
  });

  // Double-check tutor exists and has profile
  if (!tutor || tutor.role !== 'TUTOR') {
    redirect('/unauthorized?reason=invalid-tutor')
  }

  // Check if tutor profile exists
  if (!tutor.tutorProfile) {
    redirect('/tutorHub/setup?reason=profile-missing')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHubHeader tutor={tutor} tutorProfile={tutor.tutorProfile} />
      <div>
        {children}
      </div>
    </div>
  )
}