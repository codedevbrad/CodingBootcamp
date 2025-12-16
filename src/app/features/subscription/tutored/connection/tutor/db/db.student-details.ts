"use server";

import { prisma } from "@/lib/db/prisma";
import { getTutorProfileId } from "./db.tutor-profile";

/* ----------------------------------------------------
   GET STUDENT SUBSCRIPTION WITH SESSIONS AND HOMEWORK
---------------------------------------------------- */
export async function getStudentSubscription(studentProfileId: string) {
  const tutorProfileId = await getTutorProfileId();
  
  return prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
      endedAt: null,
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
      sessions: {
        orderBy: {
          startTime: "desc",
        },
      },
      homework: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          sessions: true,
          homework: true,
        },
      },
    },
  });
}

/* ----------------------------------------------------
   GET STUDENT SESSIONS
---------------------------------------------------- */
export async function getStudentSessions(studentProfileId: string) {
  const tutorProfileId = await getTutorProfileId();
  
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
      endedAt: null,
    },
  });

  if (!subscription) return [];

  return prisma.tutoringSession.findMany({
    where: {
      tutorSubscriptionId: subscription.id,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      startTime: "desc",
    },
  });
}

/* ----------------------------------------------------
   GET STUDENT HOMEWORK
---------------------------------------------------- */
export async function getStudentHomework(studentProfileId: string) {
  const tutorProfileId = await getTutorProfileId();
  
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
      endedAt: null,
    },
  });

  if (!subscription) return [];

  return prisma.homework.findMany({
    where: {
      tutorSubscriptionId: subscription.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* ----------------------------------------------------
   GET SINGLE HOMEWORK BY ID
---------------------------------------------------- */
export async function getHomeworkById(homeworkId: string, studentProfileId: string) {
  const tutorProfileId = await getTutorProfileId();
  
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
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
  });

  if (!subscription) return null;

  return prisma.homework.findFirst({
    where: {
      id: homeworkId,
      tutorSubscriptionId: subscription.id,
    },
  });
}

/* ----------------------------------------------------
   GET STUDENT HISTORY (ALL EVENTS CHRONOLOGICALLY)
---------------------------------------------------- */
export async function getStudentHistory(studentProfileId: string) {
  const tutorProfileId = await getTutorProfileId();
  
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
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
  });

  if (!subscription) {
    return {
      subscription: null,
      sessions: [],
      homework: [],
      tutorRequest: null,
    };
  }

  // Get all sessions
  const sessions = await prisma.tutoringSession.findMany({
    where: {
      tutorSubscriptionId: subscription.id,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  // Get all homework
  const homework = await prisma.homework.findMany({
    where: {
      tutorSubscriptionId: subscription.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get tutor request history
  const tutorRequest = await prisma.tutorRequest.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    subscription,
    sessions,
    homework,
    tutorRequest,
  };
}

