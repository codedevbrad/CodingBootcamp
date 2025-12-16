"use server";

import { prisma } from "@/lib/db/prisma";
import { getTutorProfileId } from "./db.tutor-profile";
import { revalidatePath } from "next/cache";
import { HomeworkStatus } from "@prisma/client";

/* ----------------------------------------------------
   GET TOPICS FOR HOMEWORK ASSIGNMENT
---------------------------------------------------- */
export async function getTopicsForHomework() {
  return prisma.topic.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
    },
    orderBy: {
      title: "asc",
    },
  });
}

/* ----------------------------------------------------
   GET PROJECTS FOR HOMEWORK ASSIGNMENT
---------------------------------------------------- */
export async function getProjectsForHomework() {
  return prisma.project.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
    },
    orderBy: {
      title: "asc",
    },
  });
}

/* ----------------------------------------------------
   GET CHALLENGES FOR HOMEWORK ASSIGNMENT
---------------------------------------------------- */
export async function getChallengesForHomework() {
  return prisma.challenge.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
    },
    orderBy: {
      title: "asc",
    },
  });
}

/* ----------------------------------------------------
   CREATE HOMEWORK
---------------------------------------------------- */
export async function createHomework(
  studentProfileId: string,
  data: {
    title: string;
    description?: string;
    dueDate?: Date;
    tasks: Array<{
      type: "topic" | "project" | "challenge" | "custom";
      id?: string;
      title?: string;
      content?: string;
    }>;
  }
) {
  const tutorProfileId = await getTutorProfileId();

  // Get the subscription
  const subscription = await prisma.tutorSubscription.findFirst({
    where: {
      tutorProfileId,
      studentProfileId,
      endedAt: null,
    },
  });

  if (!subscription) {
    throw new Error("Active subscription not found");
  }

  // Create homework with tasks stored as JSON
  const homework = await prisma.homework.create({
    data: {
      title: data.title,
      description: data.description,
      tutorSubscriptionId: subscription.id,
      dueDate: data.dueDate,
      status: HomeworkStatus.ASSIGNED,
      tasks: data.tasks,
    },
  });

  revalidatePath(`/tutorhub/students/${studentProfileId}/homework`);
  revalidatePath(`/tutorhub/students/${studentProfileId}`);

  return homework;
}

