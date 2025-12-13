"use server";

import { prisma } from "@/lib/db/prisma";

/* ----------------------------------------------------
   GET ALL PROJECTS FOR STUDENTS (with relations)
---------------------------------------------------- */
export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      categories: { include: { category: true } },
      languages: { include: { language: true } },
      difficulty: true,
    },
  });
}

/* ----------------------------------------------------
   GET PROJECT BY SLUG FOR STUDENTS (with relations)
---------------------------------------------------- */
export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: true } },
      languages: { include: { language: true } },
      difficulty: true,
    },
  });
}

