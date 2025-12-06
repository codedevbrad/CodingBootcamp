"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useCurrentUserState , getUserInitials } from "@/app/(website)/platform/session/auth.client.getUser"
import GuestProfile from "@/app/(website)/platform/(content)/guest/_components/guest.profile"

export default function ProfileDisplayed() {
  const { user, isLoading, isUnauthenticated } = useCurrentUserState()

  // While loading, show a simple skeleton to avoid layout shift
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 mb-3 border-b-1 pb-3 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-1">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-2 w-32 rounded bg-muted" />
        </div>
      </div>
    )
  }

  // If there's no authenticated user, render guest state
  if (isUnauthenticated || !user) {
    
    return (
      <div className="flex items-center gap-3 mb-3 border-b-1 pb-3">
        <GuestProfile />
      </div>
    )
  }

  const initials = getUserInitials(user, "U")

  return (
    <div className="flex items-center gap-3 mb-3 border-b-1 pb-3">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User avatar"} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-foreground leading-none">
          {user.name ?? "Student"}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.email ?? "Logged in"}
        </p>
      </div>
    </div>
  )
}
