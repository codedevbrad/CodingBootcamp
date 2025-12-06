"use server"

import { prisma } from "@/lib/db/prisma"
import { SubscriptionTier, SubscriptionStatus, Prisma } from "@prisma/client"

type MinimalUser = { id: string }
type TransactionClient = Omit<Prisma.TransactionClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

/**
 * Create (or ensure) a StudentProfile for this user and attach a BASIC subscription.
 * Idempotent: if profile exists, it won't recreate; if an ACTIVE sub exists, it won't duplicate.
 */

export async function CreateNewStudent(user: MinimalUser) {
  if (!user?.id) {
    throw new Error("CreateNewStudent: user.id is required")
  }

  const result = await prisma.$transaction(async (tx) => {
    const student = await ensureStudentProfile(tx, user.id)
    const subscriptionCreated = await ensureActiveSubscription(tx, student.id)
    
    return {
      studentProfileId: student.id,
      createdFree: subscriptionCreated,
    }
  })

  logResult(result)
  return { ok: true, ...result }
}

/**
 * Ensures a StudentProfile exists for the given userId.
 * Returns the profile ID if it exists or was created.
 */
async function ensureStudentProfile(
  tx: TransactionClient,
  userId: string
): Promise<{ id: string }> {
  return await tx.studentProfile.upsert({
    where: { userId },
    update: {}, // no-op update if exists
    create: { userId },
    select: { id: true },
  })
}

/**
 * Gets the existing subscription for a student profile, if any.
 */
async function getExistingSubscription(
  tx: TransactionClient,
  studentProfileId: string
) {
  return await tx.subscription.findUnique({
    where: { studentProfileId },
    select: { id: true, tier: true, status: true },
  })
}

/**
 * Creates a new BASIC subscription for a student profile.
 */
async function createBasicSubscription(
  tx: TransactionClient,
  studentProfileId: string
): Promise<void> {
  await tx.subscription.create({
    data: {
      studentProfileId,
      tier: SubscriptionTier.BASIC,
      status: SubscriptionStatus.ACTIVE,
    },
  })
}

/**
 * Activates an existing subscription by updating it to ACTIVE status with BASIC tier.
 */
async function activateSubscription(
  tx: TransactionClient,
  subscriptionId: string
): Promise<void> {
  await tx.subscription.update({
    where: { id: subscriptionId },
    data: {
      tier: SubscriptionTier.BASIC,
      status: SubscriptionStatus.ACTIVE,
    },
  })
}

/**
 * Ensures an active subscription exists for the student profile.
 * Returns true if a subscription was created or activated, false if one already existed.
 */
async function ensureActiveSubscription(
  tx: TransactionClient,
  studentProfileId: string
): Promise<boolean> {
  const existingSub = await getExistingSubscription(tx, studentProfileId)

  if (!existingSub) {
    // No subscription exists, create a BASIC one
    await createBasicSubscription(tx, studentProfileId)
    return true
  }

  if (existingSub.status !== SubscriptionStatus.ACTIVE) {
    // Subscription exists but isn't ACTIVE, activate it
    await activateSubscription(tx, existingSub.id)
    return true
  }

  // Subscription already exists and is ACTIVE
  return false
}

/**
 * Logs the result of student creation.
 */
function logResult(result: { studentProfileId: string; createdFree: boolean }): void {
  if (result.createdFree) {
    console.log(
      `BASIC subscription created for studentProfile ${result.studentProfileId}`
    )
  } else {
    console.log(
      `StudentProfile ${result.studentProfileId} already had an ACTIVE subscription`
    )
  }
}