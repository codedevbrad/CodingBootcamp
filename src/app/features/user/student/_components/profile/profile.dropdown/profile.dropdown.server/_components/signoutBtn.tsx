"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.refresh() // This will refresh the page and update the session
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full" 
      onClick={handleSignOut}
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </Button>
  )
}