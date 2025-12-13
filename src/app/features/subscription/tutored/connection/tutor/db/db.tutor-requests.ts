"use server";

import { prisma } from "@/lib/db/prisma";
import { TutorRequestStatus } from "@prisma/client";
import { getTutorProfileId } from "./db.tutor-profile";
import { revalidatePath } from "next/cache";

/* ----------------------------------------------------
   GET TUTOR REQUESTS FOR A TUTOR
---------------------------------------------------- */
export async function getTutorRequests(tutorProfileId: string) {
  return prisma.tutorRequest.findMany({
    where: {
      tutorProfileId,
    },
    include: {
      studentProfile: {
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
      createdAt: "desc",
    },
  });
}

/* ----------------------------------------------------
   GET PENDING TUTOR REQUESTS FOR A TUTOR
---------------------------------------------------- */
export async function getPendingTutorRequests(tutorProfileId: string) {
  return prisma.tutorRequest.findMany({
    where: {
      tutorProfileId,
      status: TutorRequestStatus.PENDING,
    },
    include: {
      studentProfile: {
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
      createdAt: "desc",
    },
  });
}

/* ----------------------------------------------------
   GET TUTOR SUBSCRIPTIONS (ACTIVE STUDENTS)
---------------------------------------------------- */
export async function getTutorSubscriptions(tutorProfileId: string) {
  return prisma.tutorSubscription.findMany({
    where: {
      tutorProfileId,
      endedAt: null, // Only active subscriptions
    },
    include: {
      student: {
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
}

/* ----------------------------------------------------
   ACCEPT TUTOR REQUEST (INTERNAL - WITH PROFILE ID)
---------------------------------------------------- */
async function acceptTutorRequestInternal(requestId: string, tutorProfileId: string) {
  return prisma.$transaction(async (tx) => {
    // Update the request status
    const request = await tx.tutorRequest.update({
      where: {
        id: requestId,
        tutorProfileId, // Ensure the tutor owns this request
        status: TutorRequestStatus.PENDING, // Only accept pending requests
      },
      data: {
        status: TutorRequestStatus.ACCEPTED,
        respondedAt: new Date(),
      },
    });

    // Check if subscription already exists
    const existingSubscription = await tx.tutorSubscription.findUnique({
      where: {
        tutorProfileId_studentProfileId: {
          tutorProfileId: request.tutorProfileId,
          studentProfileId: request.studentProfileId,
        },
      },
    });

    // Create subscription if it doesn't exist
    if (!existingSubscription) {
      await tx.tutorSubscription.create({
        data: {
          tutorProfileId: request.tutorProfileId,
          studentProfileId: request.studentProfileId,
        },
      });
    }

    return request;
  });
}

/* ----------------------------------------------------
   REJECT TUTOR REQUEST (INTERNAL - WITH PROFILE ID)
---------------------------------------------------- */
async function rejectTutorRequestInternal(requestId: string, tutorProfileId: string) {
  return prisma.tutorRequest.update({
    where: {
      id: requestId,
      tutorProfileId, // Ensure the tutor owns this request
      status: TutorRequestStatus.PENDING, // Only reject pending requests
    },
    data: {
      status: TutorRequestStatus.REJECTED,
      respondedAt: new Date(),
    },
  });
}

/* ----------------------------------------------------
   ACCEPT TUTOR REQUEST (SERVER ACTION)
---------------------------------------------------- */
export async function acceptTutorRequest(requestId: string) {
  try {
    const tutorProfileId = await getTutorProfileId();
    await acceptTutorRequestInternal(requestId, tutorProfileId);
    revalidatePath("/tutorhub/requests");
    revalidatePath("/tutorhub/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Error accepting tutor request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to accept request",
    };
  }
}

/* ----------------------------------------------------
   REJECT TUTOR REQUEST (SERVER ACTION)
---------------------------------------------------- */
export async function rejectTutorRequest(requestId: string) {
  try {
    const tutorProfileId = await getTutorProfileId();
    await rejectTutorRequestInternal(requestId, tutorProfileId);
    revalidatePath("/tutorhub/requests");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting tutor request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject request",
    };
  }
}

