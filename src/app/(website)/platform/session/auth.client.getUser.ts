"use client"

import type { Session } from "next-auth"
import { useSession } from "next-auth/react"
import type { UserWithStudentProfileSession } from "@/auth"
import { SubscriptionTier } from "@prisma/client"

// Map a NextAuth session into our canonical user shape
export function mapSessionToAppUser(session: Session | null): UserWithStudentProfileSession | null {
  if (!session?.user?.id) return null

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: session.user.role,
    subscriptionTier: (session.user as UserWithStudentProfileSession).subscriptionTier as SubscriptionTier
  }
}

export type UserStatus = "loading" | "authenticated" | "unauthenticated"

// Primary hook for accessing the current user on the client
export function useCurrentUser() {
  const { data: session, status } = useSession()
  const user = mapSessionToAppUser(session ?? null)

  return {
    user,
    status: status as UserStatus,
  }
}

// Convenience hook with booleans for common UI states
export function useCurrentUserState() {
  const { user, status } = useCurrentUser()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated" && !!user
  const isUnauthenticated = status === "unauthenticated" || !user

  return {
    user,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
  }
}

// Small helper to consistently derive initials from a user-like object
export function getUserInitials(
  user: Pick<UserWithStudentProfileSession, "name"> | null | undefined,
  fallback: string = "U",
): string {
  if (!user?.name) return fallback

  const parts = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])

  if (!parts.length) return fallback

  return parts.join("").slice(0, 2).toUpperCase()
}