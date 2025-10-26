"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";

export async function getNotes() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!student) return [];

  return prisma.note.findMany({
    where: { studentProfileId: student.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createNote(title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!student) throw new Error("No student profile");

  return prisma.note.create({
    data: {
      title,
      content: {},
      studentProfileId: student.id,
    },
  });
}

export async function updateNote(
  id: string,
  data: Partial<{ title: string; content: any; summary?: string; tags?: string[] }>
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.note.update({
    where: { id },
    data,
  });
}

export async function deleteNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  await prisma.note.delete({ where: { id } });
  return { id };
}
