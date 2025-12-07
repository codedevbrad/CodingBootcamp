/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.ts

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { UserRole, SubscriptionTier } from "@prisma/client"
import { authProviders } from "./app/auth/providers"

import { CreateNewStudent } from "./app/features/user/student/_creation/student.creation"


export type UserBasicSession = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
}

declare module "next-auth" {
  export interface Session {
    provider?: string;
    accessToken?: string;
    user: UserBasicSession;
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
  providers: authProviders,
  callbacks: {
    async jwt({ token, user, account }) {
      const userId = user?.id ?? token.sub;
    
      try {
        if (userId) {
          // First, get the user's role
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
          });
    
          token.role = dbUser?.role ?? (token.role as UserRole);
        }
      } catch (err) {
        console.error("🎫 JWT role/subscription refresh failed:", err);
      }
    
      // Provider metadata
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

      console.log("🔧 Session: ", session);
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