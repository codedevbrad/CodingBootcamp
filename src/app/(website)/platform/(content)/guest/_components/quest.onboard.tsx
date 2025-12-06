"use client"

import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 
import { CustomButton } from "@/components/custom/buttons/button";

import { bootcampLoginRedirect } from "@/lib/constants/constant.flows";

export default function GuestOnboarding() {
  const { status } = useSession();

  const isGuest = status === "unauthenticated";

  if (!isGuest) return null;

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=Guest`;

  return (
    <div className="w-full flex items-center justify-center mt-10">
      <div className="w-full max-w-md p-4 rounded-lg">

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={avatarUrl} alt="Guest avatar" />
            <AvatarFallback>Guest</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-semibold">Want to join as a Student? </p>
            <p className="text-xs text-muted-foreground">
              And have access to more features and content.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You&apos;re currently using a temporary guest which means you can view the 
            platform but not access all features.
          </p>
        </div>
        <CustomButton text="Get Started" href={ bootcampLoginRedirect } />
      </div>
    </div>
  );
}
