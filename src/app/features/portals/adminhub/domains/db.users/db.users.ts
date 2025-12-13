"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

/* ----------------------------------------------------
   GET ALL TUTORS WITH STUDENT COUNT
---------------------------------------------------- */
export async function getAllTutorsWithStudentCount() {
  return prisma.tutorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tutorSubscriptions: {
        where: {
          endedAt: null, // Only count active subscriptions
        },
        select: {
          id: true,
          student: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* ----------------------------------------------------
   GET ALL STUDENTS WITH SUBSCRIPTION STATUS
---------------------------------------------------- */
export async function getAllStudentsWithSubscriptionStatus() {
  // Get all users with STUDENT role
  const studentUsers = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      studentProfile: {
        include: {
          tutorSubscriptions: {
            where: {
              endedAt: null, // Only active subscriptions
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  // Map users to include subscription status
  return studentUsers.map((user) => {
    const hasStudentProfile = !!user.studentProfile;
    const hasActiveTutoring = (user.studentProfile?.tutorSubscriptions.length ?? 0) > 0;

    // Determine subscription status
    // Guest: no studentProfile
    // Basic: has studentProfile (regardless of tutoring status)
    // Tutored: has active tutoring
    const isGuest = !hasStudentProfile;
    const isBasic = hasStudentProfile; // Basic is true if they have a profile, even with tutoring
    const isTutored = hasActiveTutoring;

    return {
      id: user.studentProfile?.id || user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      subscriptionStatus: {
        guest: isGuest,
        basic: isBasic,
        tutored: isTutored,
      },
      createdAt: user.studentProfile?.createdAt || new Date(),
    };
  });
}

/* ----------------------------------------------------
   UPDATE USER ROLE
---------------------------------------------------- */
export async function updateUserRole(userId: string, role: "ADMIN" | "TUTOR" | "STUDENT") {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

/* ----------------------------------------------------
   SET TUTOR PROFILE
---------------------------------------------------- */
export async function setTutorProfile(userId: string, bio?: string, hourlyRate?: number) {
  return prisma.tutorProfile.upsert({
    where: { userId },
    create: {
      userId,
      bio,
      hourlyRate: hourlyRate ? new Prisma.Decimal(hourlyRate) : null,
    },
    update: {
      bio,
      hourlyRate: hourlyRate ? new Prisma.Decimal(hourlyRate) : null,
    },
  });
}

