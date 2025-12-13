"use server";

import { prisma } from "@/lib/db/prisma";
import { getStudentProfileId } from "@/app/features/user/student/_domain/domain.studentProfile";

/* ----------------------------------------------------
   CHECK IF STUDENT HAS ACTIVE TUTOR SUBSCRIPTION
---------------------------------------------------- */
export async function hasActiveTutorSubscription() {
  try {
    const studentProfileId = await getStudentProfileId();
    
    const activeSubscription = await prisma.tutorSubscription.findFirst({
      where: {
        studentProfileId,
        endedAt: null, // Only active subscriptions
      },
      select: {
        id: true,
      },
    });

    return !!activeSubscription;
  } catch (error) {
    // If student profile doesn't exist, return false
    return false;
  }
}

/* ----------------------------------------------------
   GET ACTIVE TUTOR SUBSCRIPTIONS FOR STUDENT
---------------------------------------------------- */
export async function getActiveTutorSubscriptions() {
  try {
    const studentProfileId = await getStudentProfileId();
    
    return prisma.tutorSubscription.findMany({
      where: {
        studentProfileId,
        endedAt: null, // Only active subscriptions
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });
  } catch (error) {
    // If student profile doesn't exist, return empty array
    return [];
  }
}

