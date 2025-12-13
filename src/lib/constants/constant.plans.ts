import { Sparkles, BookOpen, Zap, Users, GraduationCap, FileText } from "lucide-react"

// Module types
export const MODULES = [
    { name: "CREATING", icon: Sparkles },
    { name: "TOPICS", icon: BookOpen },
    { name: "CHALLENGES", icon: Zap },
    { name: "COHORTS", icon: Users },
    { name: "JOURNEYS", icon: GraduationCap },
    { name: "MODULE_HOMEWORK", icon: FileText },
  ] as const
  

// Subscription plan data type
export type SubscriptionPlan = {
    id: string
    title: string
    description: string
    price: string
    pricePeriod?: string
    features: string[]
    buttonText: string
    buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    badge?: string
    blurColor?: string
    gradientBg?: string
    modules?: typeof MODULES
    goesTo?: string 
}


// Guest plan
export const GUEST_PLAN: SubscriptionPlan = {
    id: "guest",
    title: "Guest",
    description: "Free access to explore",
    price: "Free",
    features: [
      "Browse public content",
      "Limited preview access",
      "Community features",
    ],
    buttonText: "Continue as Guest",
    buttonVariant: "outline",
    blurColor: "bg-muted/30",
}

export const BASIC_PLAN: SubscriptionPlan = {
    id: "basic",
    title: "Basic",
    description: "Full platform access",
    price: "free",
    features: [
      "All basic features",
      "Access to all modules",
      "Progress tracking",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonVariant: "default",
    badge: "POPULAR",
    blurColor: "bg-primary/20",
    gradientBg: "bg-gradient-to-br from-primary/5 to-transparent",
    goesTo: "/auth/login"
}

export const TUTORED_PLAN: SubscriptionPlan = {

    id: "tutored",
    title: "Be Tutored",
    description: "Personalized learning experience",
    price: "$99",
    pricePeriod: "/month",
    features: [
      "1-on-1 tutoring sessions",
      "Personalized homework",
      "More content to learn from",
      "All Basic features included",
      "Priority support",
      "Custom learning path",
    ],
    buttonText: "Find a Tutor",
    buttonVariant: "outline",
    blurColor: "bg-purple-500/20",
    gradientBg: "bg-gradient-to-br from-purple-500/5 to-transparent",
    goesTo: "/subscription/tutorme"
}


export const MODULE_PLAN: SubscriptionPlan = {
    id: "modules",
    title: "Buy Modules",
    description: "Purchase individual modules to unlock more content",
    price: "Custom",
    features: [],
    buttonText: "Browse Modules",
    buttonVariant: "outline",
    blurColor: "bg-blue-500/20",
    modules: MODULES,
    goesTo: "/subscription/modules"
}


export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    GUEST_PLAN,
    BASIC_PLAN,
    TUTORED_PLAN,
    MODULE_PLAN
]