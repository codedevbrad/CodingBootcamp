'use server'

import { prisma } from "@/lib/db/prisma"
import { User } from "@/generated/prisma"

export async function CreateNewStudent ( user: User ) {
     // Auto-create StudentProfile for new users (default role is STUDENT)...
    await prisma.studentProfile.create({
        data: {
        userId: user.id,
        },
    })
    console.log("StudentProfile created for user:", user.id);
    // navigate to platform.
}