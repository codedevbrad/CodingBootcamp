"use server";

import { HomeworkStatus } from "@/generated/prisma";
import { prisma } from "@/lib/db/prisma";

export type HomeworkTask = { text: string; done?: boolean };
export type HomeworkDTO = {
  id: string;
  title: string;
  description: string | null;
  status: HomeworkStatus
  dueDate: string | null;
  createdAt: string;
  tasks: HomeworkTask[];
};

function normalizeTasks(raw: any): { text: string; done?: boolean }[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(JSON.stringify(raw)); // ensure plain JS object
  } catch {
    return [];
  }
}

// ---- LIST ----
export async function listStudentHomework(studentId: string): Promise<HomeworkDTO[]> {
  const rows = await prisma.homework.findMany({
    where: { tutorAssignment: { studentProfileId: studentId } },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      createdAt: true,
      tasks: true,
    },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? null,
    status: r.status as HomeworkDTO["status"],
    dueDate: r.dueDate ? r.dueDate.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    tasks: normalizeTasks(r.tasks), // ✅ always array
  }));
}
