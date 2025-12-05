"use client"

import type { Session } from "next-auth"
import { useSession } from "next-auth/react"
import type { UserRole, SubscriptionTier } from "@/generated/prisma"

// Client-side user type derived from NextAuth session
export type ClientUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: UserRole | null
  subscriptionTier: SubscriptionTier | null
}

// Map a NextAuth session into our canonical ClientUser shape
export function mapSessionToAppUser(session: Session | null): ClientUser | null {
  if (!session?.user?.id) return null

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: session.user.role ?? null,
    subscriptionTier: session.user.subscriptionTier ?? null,
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
  user: Pick<ClientUser, "name"> | null | undefined,
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

