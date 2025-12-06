"use server"

import { auth } from "@/auth"
import type { UserWithStudentProfileSession } from "@/auth"
import { SubscriptionTier, UserRole } from "@prisma/client"

// Centralised helper to get the "app user" shape from the NextAuth session
export async function getUser(): Promise<UserWithStudentProfileSession| null> {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: session.user.role as UserRole,
    subscriptionTier: (session.user as UserWithStudentProfileSession).subscriptionTier as SubscriptionTier,
  }
}

export async function getUserId() {
  const session = await auth();
  if (!session?.user) throw new Error('User not authenticated');
  return session.user.id;
}