"use server"

import { prisma } from "@/lib/db/prisma";

import { revalidatePath } from "next/cache";
import { SubscriptionTier } from "@/generated/prisma"

import { getStudentProfileId } from "@/app/models/db.student/db.student"

/** Get current ACTIVE subscription (and tutor, if tutored) */

export async function getSubscriptionTier ( ) {
  const studentProfileId = await getStudentProfileId();
  const sub = await prisma.subscription.findFirst({
    where: { studentProfileId, status: "ACTIVE" },
    select: { tier: true },
  });
  return sub?.tier;
}


export async function getMySubscription ( ) {
  const studentProfileId = await getStudentProfileId();

  const sub = await prisma.subscription.findFirst({
    where: { studentProfileId, status: "ACTIVE" },
    include: {
      tutorAssignment: {
        include: {
          tutor: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!sub) return null;

  return {
    id: sub.id,
    tier: sub.tier as SubscriptionTier,
    status: sub.status,
    startDate: sub.createdAt.toISOString(),
    endDate: null, // endDate field not in schema - add to schema if needed
    tutor: sub.tutorAssignment
      ? {
        tutorProfileId: sub.tutorAssignment.tutorProfileId,
        name: sub.tutorAssignment.tutor.user?.name ?? "Your Tutor",
        image: sub.tutorAssignment.tutor.user?.image ?? null,
      }
      : null,
  };
}


/** Update or create subscription (one-to-one relationship enforced by @unique). */
async function activateSubscription(opts: {
  studentProfileId: string;
  tier: SubscriptionTier;
  endDate?: Date; // Note: endDate field not in schema - will be ignored until added to schema
}) {
  const { studentProfileId, tier } = opts;

  // Since studentProfileId is @unique, we can only have one subscription
  // Use upsert to update existing or create new
  const sub = await prisma.subscription.upsert({
    where: { studentProfileId },
    update: {
      tier,
      status: "ACTIVE",
      // endDate not in schema - add to schema if subscription expiration is needed
    },
    create: {
      studentProfileId,
      tier,
      status: "ACTIVE",
      // endDate not in schema - add to schema if subscription expiration is needed
    },
  });

  return sub;
}

// --------- public actions ---------

export async function startFreeTierAction() {
  const studentProfileId = await getStudentProfileId();

  const sub = await activateSubscription({ studentProfileId, tier: "FREE" });
  revalidatePath("/dashboard");
  return { ok: true, plan: sub.tier, status: sub.status, subscriptionId: sub.id };
}

export async function purchaseBasicAction() {
  const studentProfileId = await getStudentProfileId();

  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  const sub = await activateSubscription({ studentProfileId, tier: "BASIC", endDate: end });
  revalidatePath("/dashboard");
  return { ok: true, plan: sub.tier, status: sub.status, subscriptionId: sub.id };
}

export async function purchaseTutoredAction(formData: FormData) {
  const tutorProfileId = String(formData.get("tutorProfileId") ?? "");
  if (!tutorProfileId) return { ok: false, error: "Tutor is required." };

  const studentProfileId = await getStudentProfileId();

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    select: { id: true },
  });
  if (!tutor) return { ok: false, error: "Selected tutor not found." }

  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  const sub = await activateSubscription({ studentProfileId, tier: "TUTORED", endDate: end });

  await prisma.tutorAssignment.create({
    data: {
      subscriptionId: sub.id,
      tutorProfileId,
      studentProfileId,
      status: "ACTIVE",
    },
  });

  revalidatePath("/dashboard");
  return { ok: true, plan: sub.tier, status: sub.status, subscriptionId: sub.id, tutorProfileId };
}

export async function getTutorsAction() {
  const tutors = await prisma.tutorProfile.findMany({
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return tutors.map((t) => ({
    tutorProfileId: t.id,
    userId: t.user?.id ?? null,
    name: t.user?.name ?? "Unnamed Tutor",
    image: t.user?.image ?? null,
    hourlyRate: t.hourlyRate ? t.hourlyRate.toString() : null,
  }));
}