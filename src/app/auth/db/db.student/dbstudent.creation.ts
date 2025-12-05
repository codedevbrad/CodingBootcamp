"use server"

import { prisma } from "@/lib/db/prisma"
import { SubscriptionTier } from "@/generated/prisma" // enums from your custom client output
// If you prefer, you can avoid importing the enum and use "FREE" as a string literal.

type MinimalUser = { id: string }

/**
 * Create (or ensure) a StudentProfile for this user and attach a FREE subscription.
 * Idempotent: if profile exists, it won't recreate; if an ACTIVE sub exists, it won't duplicate.
*/

export async function CreateNewStudent(user: MinimalUser) {
  if (!user?.id) throw new Error("CreateNewStudent: user.id is required")

  const result = await prisma.$transaction(async (tx) => {
    const student = await tx.studentProfile.upsert({
      where: { userId: user.id },
      update: {}, // no-op update
      create: {
        userId: user.id,
      },
      select: { id: true },
    })

    // 2) Upsert subscription: create FREE if none exists, or update to ACTIVE if it exists but isn't ACTIVE
    // Since studentProfileId is @unique, we can only have one subscription per student
    const existingSub = await tx.subscription.findUnique({
      where: { studentProfileId: student.id },
      select: { id: true, tier: true, status: true },
    })

    let createdFree = false
    if (!existingSub) {
      // No subscription exists, create a FREE one
      await tx.subscription.create({
        data: {
          studentProfileId: student.id,
          tier: "FREE" as SubscriptionTier,
          status: "ACTIVE",
        },
      })
      createdFree = true
    } else if (existingSub.status !== "ACTIVE") {
      // Subscription exists but isn't ACTIVE, update it to ACTIVE/FREE
      await tx.subscription.update({
        where: { id: existingSub.id },
        data: {
          tier: "FREE" as SubscriptionTier,
          status: "ACTIVE",
        },
      })
      createdFree = true
    }

    return { studentProfileId: student.id, createdFree }
  })

  // (Optional logging)
  if (result.createdFree) {
    console.log(`FREE subscription created for studentProfile ${result.studentProfileId}`)
  } 
  else {
    console.log(`StudentProfile ${result.studentProfileId} already had an ACTIVE subscription`)
  }
  return { ok: true, ...result }
}