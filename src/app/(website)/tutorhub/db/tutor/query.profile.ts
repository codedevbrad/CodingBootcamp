// app/actions/getTutorProfile.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { TutorProfileDTO } from "../../store/useTutorStore";


export async function getTutorProfile(): Promise<TutorProfileDTO> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Load user + role + tutor profile
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tutorProfile: true,
      accounts: { select: { provider: true, providerAccountId: true } },
    },
  });

  if (!me) throw new Error("User not found");
  if (me.role !== "TUTOR" || !me.tutorProfile) throw new Error("Tutor access only");

  const tp = me.tutorProfile;

  return {
    user: {
      id: me.id,
      name: me.name,
      email: me.email,
      image: me.image,
      role: me.role,
    },
    tutorProfile: {
      id: tp.id,
      bio: tp.bio,
      hourlyRate: tp.hourlyRate ? tp.hourlyRate.toString() : null,
      availability: tp.availability ?? null,
      createdAt: tp.createdAt.toISOString(),
      updatedAt: tp.updatedAt.toISOString(),
    },
    accounts: me.accounts,
  };
}
