import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import TutorDashboard from './dashboard'


export default async function TutorHubPage() {
  
  // Get current session
  const session = await auth();

  // Get full tutor data with profile
  const tutor = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tutorProfile: true,
      accounts: true,
    }
  });

  return (
    <div className="min-h-screen">
      <TutorDashboard tutor={tutor} tutorProfile={tutor.tutorProfile} />
    </div>
  );
}