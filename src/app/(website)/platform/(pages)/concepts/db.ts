"use server";

import { prisma } from "@/lib/db/prisma";

export async function fetchConcepts() {
  return prisma.concept.findMany({
    orderBy: { updatedAt: "desc" },

    include: {
      // Use relations you already defined ⬇
      topics: {
        include: {
          languages: { include: { language: true } },
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
  

export async function getConceptBySlugSA(slug: string) {
  if (!slug) return null;

  return prisma.concept.findUnique({
    where: { key: slug },   // ✅ correct lookup
    include: {
      topics: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          estMins: true,
          description: true,
          // include status later if you store it
        },
      },
    },
  });
}


export async function getTopicBySlug( slug: string) {
  if (!slug) return null;

  return prisma.topic.findUnique({
    where: { slug },
    include: {
      languages: {
        include: {
          language: true, // returns { id, title }
        },
      },
      categories: {
        include: {
          category: true, // returns { id, title }
        },
      },
  }
})
}
