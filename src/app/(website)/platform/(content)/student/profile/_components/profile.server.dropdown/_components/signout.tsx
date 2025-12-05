"use server"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

import { signOut } from "@/auth"

export async function signOutAction() {
  await signOut()
}

export default async function SignOutButton() {
    return (
        <Button variant="outline" size="sm" className="w-full" onClick={signOutAction}>
            <LogOut className="w-4 h-4" />
            Sign out
        </Button>
    )
}