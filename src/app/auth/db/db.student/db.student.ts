
import { prisma } from "../../../../lib/db/prisma"
import { getUserId } from "../../session/auth.server.getUser"
import type { StudentWithProfile } from "../../auth.types"


export async function getStudentWithProfile(): Promise<StudentWithProfile | null> {
  const userId = await getUserId()

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
    },
  })
}

export async function getStudentProfileId ( ) {
  const userId = await getUserId();
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!student) throw new Error("No student profile found for current user.");
  return student.id;
}