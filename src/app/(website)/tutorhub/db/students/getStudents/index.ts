// app/actions/listTutorStudents.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export type TutorStudentDTO = {
  id: string; // StudentProfile id
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  // timestamps
  createdAt: string; // ISO
  updatedAt: string; // ISO
};


export async function listTutorStudents(): Promise<TutorStudentDTO[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // ensure the user is a tutor and get their TutorProfile id
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, tutorProfile: { select: { id: true } } },
  });

  if (!me?.tutorProfile || me.role !== "TUTOR") {
    throw new Error("Tutor access only");
  }

  const students = await prisma.studentProfile.findMany({
    where: {
      tutorAssignments: {
        some: { tutorProfileId: me.tutorProfile.id }
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  return students.map((s) => ({
    id: s.id,
    user: s.user,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
};