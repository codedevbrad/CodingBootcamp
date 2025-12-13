"use server";

import { prisma } from "@/lib/db/prisma";
import { randomUUID } from "crypto";

/* ----------------------------------------------------
   CREATE TUTOR INVITATION
---------------------------------------------------- */
export async function createTutorInvitation(
  email: string,
  createdBy: string,
  expiresInDays?: number
) {
  // Generate a unique invitation ID (16 characters, URL-safe)
  const invitationId = randomUUID().replace(/-/g, "").substring(0, 16);
  
  return prisma.tutorInvitation.create({
    data: {
      email: email.toLowerCase().trim(),
      invitationId,
      createdBy,
      expiresAt: expiresInDays 
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
        : null,
    },
  });
}

/* ----------------------------------------------------
   GET TUTOR INVITATION BY ID
---------------------------------------------------- */
export async function getTutorInvitation(invitationId: string) {
  return prisma.tutorInvitation.findUnique({
    where: { invitationId },
  });
}

/* ----------------------------------------------------
   GET TUTOR INVITATION BY EMAIL
---------------------------------------------------- */
export async function getTutorInvitationByEmail(email: string) {
  return prisma.tutorInvitation.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      used: false,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

/* ----------------------------------------------------
   MARK INVITATION AS USED
---------------------------------------------------- */
export async function markInvitationAsUsed(
  invitationId: string,
  userId: string
) {
  return prisma.tutorInvitation.update({
    where: { invitationId },
    data: {
      used: true,
      usedAt: new Date(),
      usedBy: userId,
    },
  });
}

/* ----------------------------------------------------
   GET ALL TUTOR INVITATIONS
---------------------------------------------------- */
export async function getAllTutorInvitations() {
  return prisma.tutorInvitation.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/* ----------------------------------------------------
   DELETE TUTOR INVITATION
---------------------------------------------------- */
export async function deleteTutorInvitation(invitationId: string) {
  return prisma.tutorInvitation.delete({
    where: { invitationId },
  });
}

