/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.ts

import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "./generated/prisma"
import { CreateNewStudent} from "./app/(website)/platform/authflow/auth.onboard"

declare module "next-auth" {
  interface Session {
    provider?: string;
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    role?: UserRole;
  }
}

console.log("🔧 Auth.ts: Initializing NextAuth configuration");
console.log("🔧 Environment check:", {
  hasAuthSecret: !!process.env.AUTH_SECRET,
  hasGithubId: !!process.env.AUTH_GITHUB_ID,
  hasGithubSecret: !!process.env.AUTH_GITHUB_SECRET,
});

export const {
  handlers: { GET, POST },
  auth,
  signIn, signOut
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔑 SignIn callback triggered");
      console.log("🔑 User:", JSON.stringify(user, null, 2));
      console.log("🔑 Account:", JSON.stringify(account, null, 2));
      console.log("🔑 Profile:", JSON.stringify(profile, null, 2));
      return true;
    },
    
    async jwt({ token, account, user }) {
      console.log("🎫 JWT callback triggered");
      
      if (user?.id) {
        // Fetch user with role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          console.log("🎫 Setting user role from DB:", dbUser.role);
        } else {
          token.role = UserRole.STUDENT; // Default role
          console.log("🎫 Setting default role:", UserRole.STUDENT);
        }
      }
      
      if (account) {
        console.log("🎫 Setting provider:", account.provider);
        console.log("🎫 Setting access token:", !!account.access_token);
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("👤 Session callback triggered");
      
      session.provider = token.provider;
      session.accessToken = token.accessToken;
      session.user.id = token.sub!;
      session.user.role = token.role;
      
      console.log("👤 Session user role:", session.user.role);
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
    async createUser({user}) {
      console.log("📧 Event: createUser" , user.id );
       try {
          await CreateNewStudent( user );
      } 
      catch (error) {
        console.error("Error creating StudentProfile:", error)
        // Don't throw - we don't want to prevent user creation if profile creation fails
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