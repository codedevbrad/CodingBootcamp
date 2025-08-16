// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github" // swap/add providers as needed

export const { 
  handlers: { GET, POST },  // for /api/auth/[...nextauth]
  auth,                      // server helper: await auth()
  signIn, signOut            // server actions (optional)
} = NextAuth({
  secret: process.env.AUTH_SECRET, // required in prod
  session: { strategy: "jwt" },    // no DB needed
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    // Add more providers here (Google, Credentials, etc.)
  ],
  // (Optional) callbacks to shape the session/JWT
 callbacks: {
  async jwt({ token, account }) {
    if (account) {
      token.provider = account.provider
      token.accessToken = account.access_token
    }
    return token
  },
  async session({ session, token }) {
    session.provider = token.provider
    session.accessToken = token.accessToken
    session.user.id = token.sub!
    return session
  },
}
})
