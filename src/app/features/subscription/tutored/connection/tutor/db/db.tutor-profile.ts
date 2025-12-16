"use server";

import { prisma } from "@/lib/db/prisma";
import { getUserId } from "@/app/auth/session/auth.server.getUser";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

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

/* ----------------------------------------------------
   UPDATE TUTOR PROFILE
---------------------------------------------------- */
export async function updateTutorProfile(data: {
  bio?: string | null;
  hourlyRate?: number | null;
  availability?: Record<string, { start: string; end: string } | null> | null;
}) {
  const userId = await getUserId();
  
  const updateData: {
    bio?: string | null;
    hourlyRate?: number | null;
    availability?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  } = {};

  if (data.bio !== undefined) {
    updateData.bio = data.bio || null;
  }

  if (data.hourlyRate !== undefined) {
    updateData.hourlyRate = data.hourlyRate ? Math.round(data.hourlyRate) : null;
  }

  if (data.availability !== undefined) {
    updateData.availability = data.availability as Prisma.InputJsonValue;
  }

  const profile = await prisma.tutorProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...updateData,
    },
    update: updateData,
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

  revalidatePath("/tutorhub/profile");

  return profile;
}

