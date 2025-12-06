"use server";

import { prisma } from "@/lib/db/prisma";
import { UserRole, SubscriptionTier, SubscriptionStatus } from "@prisma/client";

/* ----------------------------------------------------
   GET ALL USERS WITH ROLES AND PROFILES
---------------------------------------------------- */

export async function getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        adminProfile: {
          select: {
            id: true,
            permissions: true,
            createdAt: true,
          },
        },
        tutorProfile: {
          select: {
            id: true,
            bio: true,
            hourlyRate: true,
            createdAt: true,
          },
        },
        studentProfile: {
          select: {
            id: true,
            level: true,
            bio: true,
            createdAt: true,
            subscriptions: {
              select: {
                tier: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        // Order by the profile's createdAt - we'll need to handle this differently
        // since we can't directly order by a nested field in this way
        // For now, we'll order by id as a fallback
        id: "desc",
      },
    });
}


/* ----------------------------------------------------
   UPDATE USER ROLE
---------------------------------------------------- */
export async function updateUserRole(userId: string, newRole: UserRole) {
  // First, get the current user to check their current role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      adminProfile: true,
      tutorProfile: true,
      studentProfile: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If role hasn't changed, return early
  if (user.role === newRole) {
    return user;
  }

  // Use a transaction to update role and manage profiles
  return prisma.$transaction(async (tx) => {
    // Update the user role
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Delete old profiles that don't match the new role
    if (newRole !== "ADMIN" && user.adminProfile) {
      await tx.adminProfile.delete({
        where: { userId },
      });
    }
    if (newRole !== "TUTOR" && user.tutorProfile) {
      await tx.tutorProfile.delete({
        where: { userId },
      });
    }
    if (newRole !== "STUDENT" && user.studentProfile) {
      await tx.studentProfile.delete({
        where: { userId },
      });
    }

    // Create profile for new role if it doesn't exist
    if (newRole === "ADMIN" && !user.adminProfile) {
      await tx.adminProfile.create({
        data: {
          userId,
          permissions: [],
        },
      });
    }
    if (newRole === "TUTOR" && !user.tutorProfile) {
      await tx.tutorProfile.create({
        data: {
          userId,
        },
      });
    }
    if (newRole === "STUDENT" && !user.studentProfile) {
      const studentProfile = await tx.studentProfile.create({
        data: {
          userId,
        },
      });
      
      // Create BASIC subscription with ACTIVE status
      await tx.subscription.upsert({
        where: { studentProfileId: studentProfile.id },
        create: {
          studentProfileId: studentProfile.id,
          tier: SubscriptionTier.BASIC,
          status: SubscriptionStatus.ACTIVE,
        },
        update: {
          tier: SubscriptionTier.BASIC,
          status: SubscriptionStatus.ACTIVE,
        },
      });
    }

    return updatedUser;
  });
}

/* ----------------------------------------------------
   CREATE/SET ADMIN PROFILE
---------------------------------------------------- */
export async function setAdminProfile(
  userId: string,
  permissions: string[] = []
) {
  return prisma.adminProfile.upsert({
    where: { userId },
    create: {
      userId,
      permissions,
    },
    update: {
      permissions,
    },
  });
}

/* ----------------------------------------------------
   CREATE/SET TUTOR PROFILE
---------------------------------------------------- */
export async function setTutorProfile(
  userId: string,
  data?: {
    bio?: string;
    hourlyRate?: number;
  }
) {
  return prisma.tutorProfile.upsert({
    where: { userId },
    create: {
      userId,
      bio: data?.bio,
      hourlyRate: data?.hourlyRate ? data.hourlyRate : undefined,
      availability: data?.availability,
    },
    update: {
      bio: data?.bio,
      hourlyRate: data?.hourlyRate ? data.hourlyRate : undefined,
      availability: data?.availability,
    },
  });
}

/* ----------------------------------------------------
   CREATE/SET STUDENT PROFILE
---------------------------------------------------- */
export async function setStudentProfile(
  userId: string,
  data?: {
    level?: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
    bio?: string;
    countryCode?: string;
    skills?: string[];
    goals?: string;
  }
) {
  return prisma.$transaction(async (tx) => {
    // Upsert student profile
    const studentProfile = await tx.studentProfile.upsert({
      where: { userId },
      create: {
        userId,
        level: data?.level || "BEGINNER",
        bio: data?.bio || "",
        countryCode: data?.countryCode || "",
        skills: data?.skills || [],
        goals: data?.goals || "",
      },
      update: {
        level: data?.level,
        bio: data?.bio,
        countryCode: data?.countryCode,
        skills: data?.skills,
        goals: data?.goals,
      },
    });

    // Ensure subscription exists (BASIC tier, ACTIVE status)
    await tx.subscription.upsert({
      where: { studentProfileId: studentProfile.id },
      create: {
        studentProfileId: studentProfile.id,
        tier: SubscriptionTier.BASIC,
        status: SubscriptionStatus.ACTIVE,
      },
      update: {
        // Only update if subscription exists but isn't ACTIVE
        // Otherwise keep existing tier/status
        status: SubscriptionStatus.ACTIVE,
      },
    });

    return studentProfile;
  });
}

/* ----------------------------------------------------
   DELETE USER
---------------------------------------------------- */
export async function deleteUser(userId: string) {
  // Prisma will cascade delete related records (accounts, sessions, profiles, etc.)
  // due to onDelete: Cascade in the schema
  return prisma.user.delete({
    where: { id: userId },
  });
}