"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

// ---- Input validation
const schema = z.object({
  studentProfileId: z.string().min(1, "studentProfileId required"),
  title: z.string().min(1, "title required"),
  description: z.string().optional().nullable(),
  startTimeISO: z.string().datetime(), // must be ISO; you’re already sending this
  lengthMinutes: z.union([z.literal(60), z.literal(90), z.literal(120)]),
});

// ---- Map minutes → Prisma enum
const minutesToEnum: Record<60 | 90 | 120, typeof prisma.tutoringSession.fields.length["type"]> = {
  60: "MIN60",
  90: "MIN90",
  120: "MIN120",
};

export async function createTutoringSession(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const { studentProfileId, title, description, startTimeISO, lengthMinutes } = schema.parse(input);

  // Find the current user's TutorProfile
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!tutor) {
    throw new Error("You must be a tutor to create sessions.");
  }

  // (Optional) ensure the student exists
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    select: { id: true },
  });
  if (!student) {
    throw new Error("Student not found.");
  }

  // Find the ACTIVE TutorAssignment linking this tutor and student
  // If there could be multiple, pick the most recent by assignedAt
  const assignment = await prisma.tutorAssignment.findFirst({
    where: {
      tutorProfileId: tutor.id,
      studentProfileId,
      status: "ACTIVE",
    },
    orderBy: { assignedAt: "desc" },
    select: { id: true },
  });

  if (!assignment) {
    // If you want to allow PAUSED/others, relax the where and prefer ACTIVE:
    // const fallback = await prisma.tutorAssignment.findFirst({ where: { tutorProfileId: tutor.id, studentProfileId }, orderBy: { assignedAt: "desc" }, select: { id: true } });
    // if (!fallback) throw...
    throw new Error("No ACTIVE tutor assignment found for this student.");
  }

  // Parse the ISO into a Date
  const startTime = new Date(startTimeISO);
  if (Number.isNaN(startTime.getTime())) {
    throw new Error("Invalid start time.");
  }

  // (Optional) guard: don’t allow sessions in the deep past
  // if (startTime.getTime() < Date.now() - 5 * 60_000) throw new Error("Start time must be in the future.");

  // Create the session linked to the TutorAssignment
  const created = await prisma.tutoringSession.create({
    data: {
      title,
      description: description ?? undefined,
      startTime,
      length: minutesToEnum[lengthMinutes as 60 | 90 | 120],
      tutorAssignmentId: assignment.id,
    },
    select: {
      id: true,
      title: true,
      startTime: true,
      length: true,
      tutorAssignmentId: true,
    },
  });

  // Revalidate whatever your list uses
  // If you’re using route cache: revalidatePath("/tutorhub/sessions");
  // If you’re using fetch cache with tags: revalidateTag("tutor-sessions");

  try {
    revalidateTag("tutor-sessions");
  } catch {
    // no-op if you’re not using tag-based caching
  }

  return created;
}
