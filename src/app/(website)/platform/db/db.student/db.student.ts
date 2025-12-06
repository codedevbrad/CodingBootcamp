"use server"

import { User, StudentProfile } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import { getUserId } from "@/app/(website)/platform/session/auth.server.getUser"

// User from session and attached student profile relation
export type UserWithStudentProfile = User & {
  studentProfile: StudentProfile | null
}
  

export async function getStudentWithProfile(): Promise<UserWithStudentProfile | null> {
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


export async function editStudentProfile(data: Partial<StudentProfile>) {
  const profileId = await getStudentProfileId();
  
  return prisma.studentProfile.update({
    where: { id: profileId },
    data,
  });
}