"use server";

import { prisma } from "@/lib/db/prisma";
import { TutorRequestStatus } from "@prisma/client";
import { getStudentProfileId } from "@/app/features/user/student/_domain/domain.studentProfile";
import { revalidatePath } from "next/cache";

/* ----------------------------------------------------
   GET ALL TUTORS
---------------------------------------------------- */
export async function getAllTutors() {
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* ----------------------------------------------------
   CREATE TUTOR REQUEST
---------------------------------------------------- */
export async function createTutorRequest(tutorProfileId: string) {
  try {
    const studentProfileId = await getStudentProfileId();

    // Check if there's already a pending request
    const existingPendingRequest = await prisma.tutorRequest.findFirst({
      where: {
        studentProfileId,
        tutorProfileId,
        status: TutorRequestStatus.PENDING,
      },
    });

    if (existingPendingRequest) {
      return {
        success: false,
        error: "You already have a pending request with this tutor",
      };
    }

    // Check if there's already an active subscription
    const existingSubscription = await prisma.tutorSubscription.findUnique({
      where: {
        tutorProfileId_studentProfileId: {
          tutorProfileId,
          studentProfileId,
        },
      },
    });

    if (existingSubscription && !existingSubscription.endedAt) {
      return {
        success: false,
        error: "You already have an active subscription with this tutor",
      };
    }

    // Create the request
    const request = await prisma.tutorRequest.create({
      data: {
        studentProfileId,
        tutorProfileId,
        status: TutorRequestStatus.PENDING,
      },
    });

    revalidatePath("/subscription/tutorme");
    return { success: true, requestId: request.id };
  } catch (error) {
    console.error("Error creating tutor request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create request",
    };
  }
}

