"use server";

import { prisma } from "@/lib/db/prisma";
import { getUserId } from "@/app/auth/session/auth.server.getUser";

/* ----------------------------------------------------
   GET TUTOR PROFILE ID FROM USER ID
---------------------------------------------------- */
export async function getTutorProfileId() {
  const userId = await getUserId();
  
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  return tutorProfile.id;
}

/* ----------------------------------------------------
   GET TUTOR PROFILE WITH USER
---------------------------------------------------- */
export async function getTutorProfile() {
  const userId = await getUserId();
  
  return prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

