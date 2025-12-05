'use server'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

import { UserAvatar } from "./_components/userAvatar"
import GuestProfile from "@/app/(website)/platform/(content)/guest/_components/guest.profile"
import SignOutButton from "./_components/signout"

import { getUser } from "@/app/auth/session/auth.server.getUser"

import CurrentSubscriptionTier from "@/app/(website)/platform/(content)/student/subscription/_components/subscription.tier"

import ProfileLink from "./_components/profileLink"
import SubscriptionLink from "./_components/subscriptionLink"
import RenderBasedOnUserType from "@/app/auth/renderSwitch/server.renderswitch"


async function ProfileMenuStudent( ) {

  const user = await getUser();
    // Signed in → Avatar + ShadCN dropdown ...
  const initials = user?.name?.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-11 px-2 data-[state=open]:bg-accent bg-gray-100">
          <UserAvatar image={user?.image} name={user?.name ?? "User"} />
          <CurrentSubscriptionTier />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name ?? "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
                <ProfileLink />
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <SubscriptionLink />
        </DropdownMenuItem>

        <SignOutButton />

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default async function ProfileMenu ( ) {
  
  return <RenderBasedOnUserType student={<ProfileMenuStudent />} guest={<GuestProfile />} />
}