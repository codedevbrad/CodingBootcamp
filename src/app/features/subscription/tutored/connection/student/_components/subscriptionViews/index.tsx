"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCurrentUserState } from "@/app/auth/session/auth.client.getUser"
import { useStudentProfile } from "@/app/features/user/student/_contexts/use.studentProfile"
import { useTutorSubscription } from "../../contexts/use.tutorSubscription"
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from "@/lib/constants/constant.plans"

import { useMemo } from "react"
import Link from "next/link"

// Subscription Card Component
type SubscriptionCardProps = {
  plan: SubscriptionPlan
  isActive?: boolean
  activePlanId?: string // For legacy compatibility, first active plan
}

function SubscriptionCard({ plan, isActive = false, activePlanId }: SubscriptionCardProps) {
  
  // If Basic is active and this is the Guest card
  const isBasicActiveAndGuest = activePlanId === "basic" && plan.id === "guest"
  // If Guest is active and this is the Guest card
  const isGuestActive = activePlanId === "guest" && plan.id === "guest"
  
  // Determine button text
  const getButtonText = () => {
    if (isGuestActive) {
      return "On current plan"
    }
    if (isActive && plan.id !== "guest") {
      return "Activated"
    }
    return plan.buttonText
  }

  // Hide button if Basic is active and this is Guest card
  const shouldHideButton = isBasicActiveAndGuest

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-105",
        isActive
          ? "border-primary bg-gradient-to-br from-primary/10 to-transparent"
          : "hover:border-primary/50",
        plan.gradientBg && !isActive && plan.gradientBg,
      )}
    >
      <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-bl-full blur-2xl", plan.blurColor || "bg-muted/30")} />
      
      {plan.badge && !isActive && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
            {plan.badge}
          </span>
        </div>
      )}

      {isActive && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            ACTIVE
          </span>
        </div>
      )}

      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{plan.price}</span>
          {plan.pricePeriod && (
            <span className="text-muted-foreground">{plan.pricePeriod}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-3">
        {plan.modules ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">Available modules:</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {plan.modules.map((module) => {
                const Icon = module.icon
                return (
                  <div
                    key={module.name}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{module.name.replace("_", " ")}</span>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))
        )}
      </CardContent>

      <CardFooter className="relative">
        {!shouldHideButton && (
          plan.goesTo && !isActive && !isGuestActive ? (
            <Button
              variant={plan.buttonVariant || "default"}
              className={cn(
                "w-full",
                plan.id === "tutored" && !isActive && "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              )}
              asChild
            >
              <Link href={plan.goesTo}>
                {getButtonText()}
              </Link>
            </Button>
          ) : (
            <Button
              variant={plan.buttonVariant || "default"}
              className={cn(
                "w-full",
                plan.id === "tutored" && !isActive && "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                (isActive || isGuestActive) && "cursor-default"
              )}
              disabled={isActive || isGuestActive}
            >
              {getButtonText()}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  )
}


export default function SubscriptionViews({  }) {
  const { user, isLoading: isLoadingUser, isUnauthenticated } = useCurrentUserState()
  const { studentProfile, isLoading: isLoadingProfile } = useStudentProfile()
  const { hasActiveTutoring, isLoading: isLoadingTutoring } = useTutorSubscription()

  // Determine active plans based on session, student profile, and tutoring status
  const activePlanIds = useMemo(() => {
    const active: string[] = []

    // If still loading, don't show any as active
    if (isLoadingUser || isLoadingProfile || isLoadingTutoring) {
      return []
    }

    // If no session, show Guest as active
    if (isUnauthenticated || !user) {
      active.push("guest")
      return active
    }

    // If session exists and studentProfile exists, show Basic as active
    if (studentProfile?.studentProfile) {
      active.push("basic")
    }

    // If student has active tutoring, also show Tutored as active
    if (hasActiveTutoring) {
      active.push("tutored")
    }

    // If session exists but no studentProfile, show Guest as active
    if (active.length === 0) {
      active.push("guest")
    }

    return active
  }, [user, isUnauthenticated, studentProfile, hasActiveTutoring, isLoadingUser, isLoadingProfile, isLoadingTutoring])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the subscription that fits your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isActive={activePlanIds.includes(plan.id)}
              activePlanId={activePlanIds[0]} // Use first active plan for legacy compatibility
            />
          ))}
        </div>
      </div>
    </div>
  )
}