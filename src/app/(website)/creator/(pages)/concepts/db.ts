"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

// ---- READ for SWR ----
export async function getConcepts() {
  return prisma.concept.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// ---- CREATE ----
export async function createConcept(data: { title: string; description?: string , key: string }) {

  await prisma.concept.create({
    data: {
      title: data.title,
      description: data.description,
      key: data.key
    },
  });

  revalidatePath("/dashboard/admin/concepts");
}


// ---- UPDATE ----
export async function updateConcept(id: string, data: { title: string; description?: string , key: string }) {

  await prisma.concept.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      key : data.key
    },
  });

  revalidatePath("/dashboard/admin/concepts");
}

// ---- DELETE ----
export async function deleteConcept(id: string) {
  await prisma.concept.delete({ where: { id } });
  revalidatePath("/dashboard/admin/concepts");
}

 
// GET topics for a concept
export async function getTopics(conceptId: string) {
  return prisma.topic.findMany({
    where: { conceptId },
    include: {
      languages: { include: { language: true } },
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// CREATE topic
export async function createTopic(
  conceptId: string,
  data: {
    title: string;
    description?: string;
    languageIds: string[];
    categoryIds: string[];
  }
) {
  const slug = slugify(data.title);

  await prisma.topic.create({
    data: {
      title: data.title,
      description: data.description,
      slug,
      conceptId,

      // Insert many-to-many rows
      languages: {
        create: data.languageIds.map((id) => ({ languageId: id })),
      },
      categories: {
        create: data.categoryIds.map((id) => ({ categoryId: id })),
      },
    },
  });

  revalidatePath(`/dashboard/admin/concepts/${conceptId}/topics`);
}

// UPDATE topic
export async function updateTopic(
  topicId: string,
  conceptId: string,
  data: {
    title: string;
    description?: string;
    languageIds: string[];
    categoryIds: string[];
  }
) {
  const slug = slugify(data.title);

  await prisma.topic.update({
    where: { id: topicId },
    data: {
      title: data.title,
      description: data.description,
      slug,

      // Reset & recreate language links
      languages: {
        deleteMany: {},
        create: data.languageIds.map((id) => ({ languageId: id })),
      },

      // Reset & recreate category links
      categories: {
        deleteMany: {},
        create: data.categoryIds.map((id) => ({ categoryId: id })),
      },
    },
  });

  revalidatePath(`/dashboard/admin/concepts/${conceptId}/topics`);
}

// DELETE topic
export async function deleteTopic(topicId: string, conceptId: string) {
  await prisma.topic.delete({ where: { id: topicId } });
  revalidatePath(`/dashboard/admin/concepts/${conceptId}/topics`);
}
