// middleware.ts
import { NextResponse } from "next/server"
import { auth } from "@/auth" // your re-export from NextAuth config
import { UserRole } from "@prisma/client"

export default auth(async (req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const session = req.auth // session decoded by Auth.js

  const isStudentArea = pathname.startsWith("/platform")
  const isTutorArea   = pathname.startsWith("/tutorhub")

  // Allow guests (unauthenticated users) to access /platform with free account
  // Platform is open to everyone - no authentication required
  if (isStudentArea) {
    // Allow all users (authenticated and guests) to access platform
    if ( pathname.startsWith("/platform/student") && !session?.user && session?.user?.role !== UserRole.STUDENT ) {
      return NextResponse.redirect(new URL("/platform", nextUrl))
    }
    // protect platform / student / tutored ( tutor subscription required )

    return NextResponse.next()
  }

  // Tutor area requires authentication and TUTOR role
  if (isTutorArea) {
    if (!session?.user) {
      // Not authenticated - redirect to sign-in
      const signInUrl = new URL("/api/auth/signin", nextUrl)
      signInUrl.searchParams.set("callbackUrl", nextUrl.href)
      return NextResponse.redirect(signInUrl)
    }

    const role = session.user.role
    if (role !== "TUTOR") {
      const errorUrl = new URL("/auth/unauthorized", nextUrl)
      errorUrl.searchParams.set("reason", "tutor-access-required")
      return NextResponse.redirect(errorUrl)
    }
  }


  // Everything else → allow...
  return NextResponse.next()
})

// Configure which routes middleware applies to....
export const config = {
  matcher: [
    "/platform/:path*",
    "/tutorhub/:path*",
  ],
}