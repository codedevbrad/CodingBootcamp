"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 
import { CustomButton } from "@/components/custom/buttons/button";

import { bootcampLoginRedirect } from "@/lib/constants/constant.flows";
import { useCurrentUserState } from "@/app/auth/session/auth.client.getUser";

export default function GuestOnboarding() {
  const { isLoading, isAuthenticated } = useCurrentUserState()

  // Handle loading state first to prevent content flash
  if (isLoading) return (
    <div className="w-full flex items-center justify-center mt-10">
        {/* skeleton loader */}
        <div className="w-full max-w-md p-4 rounded-lg animate-pulse"> 
          <div className="space-y-1">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-2 w-32 rounded bg-muted" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-2 w-32 rounded bg-muted" />
          </div>
        </div>
    </div>
  );

  // Don't show guest onboarding to authenticated users
  if (isAuthenticated) return null;

  return (
    <div className="w-full flex items-center justify-center mt-10">
      <div className="w-full max-w-md p-4 rounded-lg">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={ `https://api.dicebear.com/7.x/initials/svg?seed=Guest`} alt="Guest avatar" />
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
