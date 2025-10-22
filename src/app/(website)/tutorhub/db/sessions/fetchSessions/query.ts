"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type GetTutorSessionsOpts = {
  /** ISO bounds (optional). If omitted, returns all sessions. */
  fromISO?: string;
  toISO?: string;
  /** Default: "asc" by startTime */
  order?: "asc" | "desc";
};

export async function getTutorSessionsForCurrentTutorSA(
  opts: GetTutorSessionsOpts = {}
) {
  const { fromISO, toISO, order = "asc" } = opts;

  const session = await auth();
  if (!session?.user?.id) return { sessions: [] as Array<any> };

  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!tutor) return { sessions: [] as Array<any> };

  // Build where clause
  const where: any = {
    tutorAssignment: { tutorProfileId: tutor.id },
  };

  // Date filters (optional, ignore invalid dates)
  const gte = fromISO ? new Date(fromISO) : undefined;
  const lte = toISO ? new Date(toISO) : undefined;
  const validGte = gte instanceof Date && !isNaN(gte.getTime());
  const validLte = lte instanceof Date && !isNaN(lte.getTime());
  if (validGte || validLte) {
    where.startTime = {};
    if (validGte) where.startTime.gte = gte;
    if (validLte) where.startTime.lte = lte;
  }

  const rows = await prisma.tutoringSession.findMany({
    where,
    orderBy: { startTime: order },
    include: {
      tutorAssignment: {
        include: {
          student: {
            include: { user: true },
          },
        },
      },
    },
  });

  // DTO for the client
  const sessions = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? null,
    startTimeISO: r.startTime.toISOString(),
    length: r.length, // enum SessionLength
    assignmentId: r.tutorAssignmentId,
    student: {
      profileId: r.tutorAssignment.studentProfileId,
      userId: r.tutorAssignment.student.user?.id ?? null,
      name: r.tutorAssignment.student.user?.name ?? null,
      email: r.tutorAssignment.student.user?.email ?? null,
      image: r.tutorAssignment.student.user?.image ?? null,
    },
  }));

  return { sessions };
}
