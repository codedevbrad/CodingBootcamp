"use server";

import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

export type HomeworkTask = { text: string; done?: boolean };
export type HomeworkDTO = {
  id: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "ASSIGNED" | "IN_PROGRESS" | "SUBMITTED" | "RETURNED" | "COMPLETED" | "CANCELLED";
  dueDate: string | null;    // ISO
  createdAt: string;         // ISO
  tasks?: HomeworkTask[];
};

export async function listStudentHomework(studentId: string): Promise<HomeworkDTO[]> {
  const rows = await prisma.homework.findMany({
    where: { tutorAssignment: { studentProfileId: studentId } },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, title: true, description: true, status: true, dueDate: true, createdAt: true, tasks: true,
    },
  });

  return rows.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description ?? null,
    status: r.status as HomeworkDTO["status"],
    dueDate: r.dueDate ? r.dueDate.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    tasks: (r.tasks as HomeworkTask[] | null) ?? [],
  }));
}

const CreateHomeworkSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  dueDate: z.string().optional(), // ISO yyyy-mm-dd from <input type="date">
  tasks: z.array(z.object({ text: z.string().min(1), done: z.boolean().optional() })).default([]),
});

export type CreateHomeworkInput = z.infer<typeof CreateHomeworkSchema>;

/** Creates homework for the student's ACTIVE TutorAssignment (most recent if multiple) */
export async function createHomeworkForStudent(studentId: string, data: CreateHomeworkInput): Promise<HomeworkDTO> {
  const parsed = CreateHomeworkSchema.parse(data);

  const assignment = await prisma.tutorAssignment.findFirst({
    where: { studentProfileId: studentId, status: "ACTIVE" },
    orderBy: { assignedAt: "desc" },
    select: { id: true },
  });

  if (!assignment) {
    throw new Error("No ACTIVE TutorAssignment found for this student.");
  }

  const created = await prisma.homework.create({
    data: {
      title: parsed.title,
      description: parsed.description ?? null,
      tutorAssignmentId: assignment.id,
      tasks: parsed.tasks, // stored as JSON
      status: "ASSIGNED",
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
    },
    select: {
      id: true, title: true, description: true, status: true, dueDate: true, createdAt: true, tasks: true,
    },
  });

  return {
    id: created.id,
    title: created.title,
    description: created.description ?? null,
    status: created.status as HomeworkDTO["status"],
    dueDate: created.dueDate ? created.dueDate.toISOString() : null,
    createdAt: created.createdAt.toISOString(),
    tasks: (created.tasks as HomeworkTask[] | null) ?? [],
  };
}
