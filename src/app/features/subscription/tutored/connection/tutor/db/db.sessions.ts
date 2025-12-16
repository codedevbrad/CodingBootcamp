"use server";

import { prisma } from "@/lib/db/prisma";
import { getTutorProfileId } from "./db.tutor-profile";
import { revalidatePath } from "next/cache";
import { SessionLength, TutoringSessionStatus } from "@prisma/client";

/* ----------------------------------------------------
   GET SINGLE SESSION BY ID
---------------------------------------------------- */
export async function getSessionById(sessionId: string, studentProfileId: string) {
  const tutorProfileId = await getTutorProfileId();
  
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
    },
  });

  if (!subscription) return null;

  return prisma.tutoringSession.findFirst({
    where: {
      id: sessionId,
      tutorSubscriptionId: subscription.id,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
}

/* ----------------------------------------------------
   CREATE SESSION
---------------------------------------------------- */
export async function createSession(
  studentProfileId: string,
  data: {
    title: string;
    description?: string;
    startTime: Date;
    length: SessionLength;
    status?: TutoringSessionStatus;
    preSessionNotes?: any;
    postSessionContent?: any;
    categoryIds?: string[];
  }
) {
  const tutorProfileId = await getTutorProfileId();

  // Get the subscription
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
      endedAt: null,
    },
  });

  if (!subscription) {
    throw new Error("Active subscription not found");
  }

  // Create session
  const session = await prisma.tutoringSession.create({
    data: {
      title: data.title,
      description: data.description,
      tutorSubscriptionId: subscription.id,
      startTime: data.startTime,
      length: data.length,
      status: data.status || TutoringSessionStatus.PENDING,
      preSessionNotes: data.preSessionNotes,
      postSessionContent: data.postSessionContent,
      categories: data.categoryIds && data.categoryIds.length > 0 ? {
        create: data.categoryIds.map(categoryId => ({
          categoryId,
        })),
      } : undefined,
    },
  });

  revalidatePath(`/tutorhub/students/${studentProfileId}/sessions`);
  revalidatePath(`/tutorhub/students/${studentProfileId}`);

  return session;
}

/* ----------------------------------------------------
   UPDATE SESSION
---------------------------------------------------- */
export async function updateSession(
  sessionId: string,
  studentProfileId: string,
  data: {
    title: string;
    description?: string;
    startTime: Date;
    length: SessionLength;
    status?: TutoringSessionStatus;
    preSessionNotes?: any;
    postSessionContent?: any;
    categoryIds?: string[];
  }
) {
  const tutorProfileId = await getTutorProfileId();

  // Get the subscription
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
    },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  // First, delete existing category associations
  await prisma.tutoringSessionCategory.deleteMany({
    where: {
      sessionId: sessionId,
    },
  });

  // Update session
  const session = await prisma.tutoringSession.update({
    where: {
      id: sessionId,
      tutorSubscriptionId: subscription.id, // Ensure the session belongs to this subscription
    },
    data: {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      length: data.length,
      status: data.status,
      preSessionNotes: data.preSessionNotes,
      postSessionContent: data.postSessionContent,
      categories: data.categoryIds && data.categoryIds.length > 0 ? {
        create: data.categoryIds.map(categoryId => ({
          categoryId,
        })),
      } : undefined,
    },
  });

  revalidatePath(`/tutorhub/students/${studentProfileId}/sessions`);
  revalidatePath(`/tutorhub/students/${studentProfileId}/sessions/${sessionId}`);
  revalidatePath(`/tutorhub/students/${studentProfileId}`);

  return session;
}

/* ----------------------------------------------------
   DELETE SESSION
---------------------------------------------------- */
export async function deleteSession(sessionId: string, studentProfileId: string) {
  const tutorProfileId = await getTutorProfileId();

  // Get the subscription
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
    },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  // Delete session
  await prisma.tutoringSession.delete({
    where: {
      id: sessionId,
      tutorSubscriptionId: subscription.id, // Ensure the session belongs to this subscription
    },
  });

  revalidatePath(`/tutorhub/students/${studentProfileId}/sessions`);
  revalidatePath(`/tutorhub/students/${studentProfileId}`);
}

