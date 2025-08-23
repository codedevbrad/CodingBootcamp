import { signIn, signOut } from "@/auth"
import { auth } from "@/auth"
import { Github, LogOut, User } from "lucide-react"

export default async function GitHubAuth() {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
          <span className="text-sm font-medium">{session.user.name}</span>
        </div>
        
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 rounded-md bg-gray-500 px-3 py-1 text-white hover:bg-gray-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    )
  }

  return (
    <form
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 transition-colors"
      >
        <Github className="w-4 h-4" />
        Sign in with GitHub
      </button>
    </form>
  )
}