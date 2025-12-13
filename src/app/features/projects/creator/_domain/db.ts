"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

/* ----------------------------------------------------
   GET ALL PROJECTS (with relations)
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
   GET PROJECT BY SLUG (with relations)
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

/* ----------------------------------------------------
   GET DIFFICULTIES
---------------------------------------------------- */
export async function getDifficulties() {
  return prisma.difficulty.findMany({
    orderBy: { order: "asc" },
  });
}

/* ----------------------------------------------------
   CREATE PROJECT
---------------------------------------------------- */
export async function createProject(data: {
  title: string;
  slug: string;
  description?: string;
  estHours: number;
  color?: string;
  tags: string[];
  categoryIds: string[];
  languageIds: string[];
  difficultyId?: string;
}) {
  const created = await prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      estHours: data.estHours,
      color: data.color,
      tags: data.tags,
      content: {},
      guide: {},
      difficultyId: data.difficultyId || null,
      categories: {
        create: data.categoryIds.map((id) => ({
          categoryId: id,
        })),
      },
      languages: {
        create: data.languageIds.map((id) => ({
          languageId: id,
        })),
      },
    },
    include: {
      categories: { include: { category: true } },
      languages: { include: { language: true } },
      difficulty: true,
    },
  });

  revalidatePath("/creator/projects");
  return created;
}

/* ----------------------------------------------------
   UPDATE PROJECT
---------------------------------------------------- */
export async function updateProject(
  id: string,
  data: {
    title: string;
    slug: string;
    description?: string;
    estHours: number;
    color?: string;
    tags: string[];
    categoryIds: string[];
    languageIds: string[];
    difficultyId?: string;
  }
) {
  // Clear existing relations
  await prisma.projectCategory.deleteMany({
    where: { projectId: id },
  });

  await prisma.projectLanguage.deleteMany({
    where: { projectId: id },
  });

  const updated = await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      estHours: data.estHours,
      color: data.color,
      tags: data.tags,
      difficultyId: data.difficultyId || null,
      categories: {
        create: data.categoryIds.map((id) => ({
          categoryId: id,
        })),
      },
      languages: {
        create: data.languageIds.map((id) => ({
          languageId: id,
        })),
      },
    },
    include: {
      categories: { include: { category: true } },
      languages: { include: { language: true } },
      difficulty: true,
    },
  });

  revalidatePath("/creator/projects");
  return updated;
}

/* ----------------------------------------------------
   DELETE PROJECT
---------------------------------------------------- */
export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/creator/projects");
}

/* ----------------------------------------------------
   UPDATE PROJECT CONTENT
---------------------------------------------------- */
export async function updateProjectContent(
  id: string,
  content: {
    resources?: Array<{
      id: string;
      type: "article" | "video";
      title: string;
      url: string;
    }>;
    sections?: Array<{
      id: string;
      title: string;
      description: string;
      tasks: string[];
      requirements: string[];
      hints: string[];
    }>;
  }
) {
  const updated = await prisma.project.update({
    where: { id },
    data: { content: content as any },
  });

  revalidatePath(`/creator/projects/project/${updated.slug}`);
  return updated;
}