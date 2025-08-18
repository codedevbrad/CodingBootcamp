// components/header.tsx
import Link from "next/link"
import { auth, signIn, signOut } from "@/auth"
import Image from "next/image"


export default async function Header() {
  const session = await auth()

  return (
    <header className="w-full  bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left side */}
        <Link href="/" className="text-lg font-bold">
          TheCodeBootcamp
        </Link>

        {/* Right side */}
        <div>
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "user avatar"}
                  className="h-8 w-8 rounded-full"
                  width={30} height={30}
                />
              )}
              <span className="text-sm">{session.user?.name ?? session.user?.email}</span>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <form
              action={async () => {
                "use server"
                await signIn("github")
              }}
            >
              <button
                type="submit"
                className="rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              >
                Sign in with GitHub
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  )
}