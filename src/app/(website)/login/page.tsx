// app/(layout)/auth-page.tsx
import { signIn } from "@/auth"
import { Github } from "lucide-react"
import BackToHome from "../platform/authflow/back"

function GoogleLogo() {
  // Tiny inline Google "G" so you don't need another icon lib
  return (
    <svg className="h-4 w-4" viewBox="0 0 533.5 544.3" aria-hidden="true">
      <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.7-37-5-54.8H272v103.7h146.9c-6.3 34-25 62.7-53.4 82v68.2h86.2c50.4-46.4 81.8-114.8 81.8-199.1z"/>
      <path fill="#34A853" d="M272 544.3c73.9 0 135.9-24.4 181.2-66.8l-86.2-68.2c-24 16.2-54.6 25.8-95 25.8-72.9 0-134.7-49.2-156.8-115.3H25.7v72.5C70.6 484.6 164.9 544.3 272 544.3z"/>
      <path fill="#FBBC05" d="M115.2 319.8c-10.9-32.8-10.9-68.1 0-100.9V146.4H25.7c-41.8 83.5-41.8 183.9 0 267.4l89.5-94z"/>
      <path fill="#EA4335" d="M272 106.1c40.2-.6 79 14.8 108.6 42.8l81.1-81.1C407.7 23 345.8-.3 272 0 164.9 0 70.6 59.7 25.7 146.4l89.5 72.5C137.8 155.6 199.1 106.1 272 106.1z"/>
    </svg>
  )
}

export default function AuthPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex">
      <BackToHome />

      {/* Left side - Info */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Make coding our problem.
            <br />
            <span className="text-purple-300">Not yours.</span>
          </h1>

          <p className="text-xl mb-8 text-purple-100">
            Let The Code Bootcamp handle your learning journey so you can focus on becoming a developer.
          </p>

          <div className="space-y-4 text-purple-100">
            {[
              "Personalized learning paths & unlimited practice sessions",
              "Interactive coding challenges and real-world projects",
              "1-on-1 mentorship and code review sessions",
              "Progress tracking and achievement badges",
            ].map((text) => (
              <div key={text} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <p className="text-sm text-purple-300 uppercase tracking-wider mb-4">
              BUILT FOR ASPIRING DEVELOPERS, AT ANY LEVEL.
            </p>
            <div className="flex items-center space-x-6 opacity-60">
              {["React", "Node.js", "Python", "JavaScript", "TypeScript"].map((s) => (
                <div key={s} className="text-2xl font-bold">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join The Code Bootcamp</h2>

          <div className="space-y-3">
            {/* GitHub */}
            <form
              action={async () => {
                "use server"
                await signIn("github");
              }}
            >
              <button
                type="submit"
                className="w-full cursor-pointer bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>Continue with GitHub</span>
              </button>
            </form>

            {/* Google */}
            <form
              action={async () => {
                "use server"
                // Per-call account chooser; falls back to provider config if omitted
                await signIn("google", {  prompt: "select_account" } as any)
              }}
            >
              <button
                type="submit"
                className="cursor-pointer w-full bg-white text-gray-800 border border-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <GoogleLogo />
                <span>Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            By continuing, you agree to The Code Bootcamp{" "}
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
