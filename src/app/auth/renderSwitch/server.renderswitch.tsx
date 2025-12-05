"use server"

import { getUser } from "@/app/auth/session/auth.server.getUser"

export async function DontRenderIfGuest ( ) {
    const user = await getUser()
    if (!user) {
        return null
    }
} 

export default async function RenderBasedOnUserType ( { student , guest }: { student: React.ReactNode, guest: React.ReactNode }) {
    const user = await getUser()
    if (!user) {
        return guest
    }
    return student
}
