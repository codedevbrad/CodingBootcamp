// app/(layout)/auth-page.tsx
import { signIn } from "@/auth"
import { Github } from "lucide-react"
import BackToHome from "./back"

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
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Personalized learning paths & unlimited practice sessions</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Interactive coding challenges and real-world projects</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>1-on-1 mentorship and code review sessions</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Progress tracking and achievement badges</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Career support and job placement assistance</span>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-purple-300 uppercase tracking-wider mb-4">
              BUILT FOR ASPIRING DEVELOPERS, AT ANY LEVEL.
            </p>
            <div className="flex items-center space-x-6 opacity-60">
              <div className="text-2xl font-bold">React</div>
              <div className="text-2xl font-bold">Node.js</div>
              <div className="text-2xl font-bold">Python</div>
              <div className="text-2xl font-bold">JavaScript</div>
              <div className="text-2xl font-bold">TypeScript</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative">
       
          

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join The Code Bootcamp</h2>
          
          <div className="space-y-3">
            <form
              action={async () => {
                "use server"
                await signIn("github")
              }}
            >
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>Continue with GitHub</span>
              </button>
            </form>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            By continuing, you agree to The Code Bootcamp{' '}
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}