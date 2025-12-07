"use server"

import { prisma } from "@/lib/db/prisma"
import  { Prisma } from "@prisma/client"

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
    
    return {
      studentProfileId: student.id,
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
 * Logs the result of student creation.
*/

function logResult(result: { studentProfileId: string; }): void {
    console.log(
      `StudentProfile ${result.studentProfileId} Created`
    )
}