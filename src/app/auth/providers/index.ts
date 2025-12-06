import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authProviders = [
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
]