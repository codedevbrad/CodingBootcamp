import type { Metadata } from "next"
import { auth } from '@/auth'
import Header from "./(layout)/header"
import AuthPage from "./authflow/auth.signin"

export const metadata: Metadata = {
  title: "The Code Bootcamp",
  description: "Tutor Dashboard - Learning Application",
}


export default async function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Get current session
  const session = await auth();

  // If not authenticated, show auth page
  if (!session?.user) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
         <Header />
         <div>
            {children}
         </div>
    </div>
  )
}