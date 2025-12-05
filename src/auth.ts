/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.ts

import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { UserRole, SubscriptionTier, StudentProfile } from "./generated/prisma"
import { CreateNewStudent } from "./app/auth/db/db.student/dbstudent.creation"
import { StudentLevel } from "@prisma/client"

export type UserInSession = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
    subscriptionTier?: SubscriptionTier | null;
}

// User including the attached student profile relation
export type StudentWithProfile = UserInSession & {
  studentProfile: StudentProfile | null
}

// Helper function to map StudentLevel enum to display string
export function mapStudentLevelToDisplay(level: StudentLevel ) {
  switch (level) {
    case "BEGINNER":
      return "Beginner"
    case "INTERMEDIATE":
      return "Intermediate"
    case "EXPERT":
      return "Advanced"
    default:
      return "Beginner"
  }
}

// Minimal shape used by the "My profile" UI
export type StudentProfileSummary = {
  name: string | null
  role: UserRole | null
  joined: Date | null
  level: "Beginner" | "Intermediate" | "Advanced"
  bio: string
  location: string
  skills: string[]
  goals: string
  streak: number
}

declare module "next-auth" {
  export interface Session {
    provider?: string;
    accessToken?: string;
    user: UserInSession;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    role?: UserRole;
    subscriptionTier?: SubscriptionTier | null;
  }
}

console.log("🔧 Auth.ts: Initializing NextAuth configuration");
console.log("🔧 Environment check:", {
  hasAuthSecret: !!process.env.AUTH_SECRET,
  hasGithubId: !!process.env.AUTH_GITHUB_ID,
  hasGithubSecret: !!process.env.AUTH_GITHUB_SECRET,
  hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
  hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
});

export const {
  handlers: { GET, POST },
  auth,
  signIn, signOut
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth/login'
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          // GitHub doesn't support account picker, but this will re-ask consent
          prompt: "consent",
        },
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          // Always show Google account chooser
          prompt: "select_account",
          response_type: "code",
          access_type: "offline",
        },
      },
      // scopes: ["openid", "email", "profile"], // optional (defaults are fine)
    }),
  ],
// auth.ts
callbacks: {
  async jwt({ token, user, account }) {
    // 🔁 Always resolve a user id (first login: user.id, later: token.sub)
    const userId = user?.id ?? token.sub;

    try {
      if (userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { 
            role: true,
            studentProfile: {
              select: {
                subscriptions: {
                  select: { tier: true, status: true },
                },
              },
            },
          },
        });

        // Keep role in sync with DB; fall back to existing token role or STUDENT
        token.role = dbUser?.role ?? (token.role as UserRole) ?? UserRole.STUDENT;
        
        // Sync subscription tier for students (only if ACTIVE)
        if (dbUser?.role === UserRole.STUDENT) {
          const subscription = dbUser.studentProfile?.subscriptions;
          token.subscriptionTier = (subscription?.status === "ACTIVE") ? subscription.tier : null;
        } else {
          token.subscriptionTier = null;
        }
      } else {
        // No user yet (should be rare) – ensure a sane default
        token.role = (token.role as UserRole) ?? UserRole.STUDENT;
        token.subscriptionTier = null;
      }
    } catch (err) {
      console.error("🎫 JWT role/subscription refresh failed:", err);
      // Don’t break auth if DB is down; keep previous or default
      token.role = (token.role as UserRole) ?? UserRole.STUDENT;
      token.subscriptionTier = token.subscriptionTier ?? null;
    }

    // Provider metadata (first login or when account rotates)
    if (account) {
      token.provider = account.provider;
      if (account.access_token) token.accessToken = account.access_token;
    }

    return token;
  },

  async session({ session, token }) {
    session.provider = token.provider as string | undefined;
    session.accessToken = token.accessToken as string | undefined;
    session.user.id = token.sub!;
    session.user.role = token.role as UserRole | undefined;
    session.user.subscriptionTier = token.subscriptionTier as SubscriptionTier | null | undefined;
    return session;
  },
},
  events: {
    async signIn(message) {
      console.log("📧 Event: signIn", JSON.stringify(message, null, 2));
    },
    async signOut(message) {
      console.log("📧 Event: signOut", JSON.stringify(message, null, 2));
    },
    async createUser({ user }) {
      console.log("📧 Event: createUser", user.id);
      try {
        await CreateNewStudent(user);
      } catch (error) {
        console.error("Error creating StudentProfile:", error);
      }
    },
    async updateUser(message) {
      console.log("📧 Event: updateUser", JSON.stringify(message, null, 2));
    },
    async linkAccount(message) {
      console.log("📧 Event: linkAccount", JSON.stringify(message, null, 2));
    },
    async session() {
      console.log("📧 Event: session");
    },
  },
  debug: process.env.NODE_ENV === "development",
});

console.log("✅ Auth.ts: NextAuth configuration complete");