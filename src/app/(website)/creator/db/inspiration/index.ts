"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function getInspirations() {
  const inspirations = await prisma.inspiration.findMany({
    orderBy: { createdAt: "desc" },
  });
  return inspirations;
}

export async function createInspiration(data: {
  title: string;
  content: any;
  sourceUrl?: string;
  tags?: string[];
  type?: string;
}) {
  await prisma.inspiration.create({
    data: {
      title: data.title,
      content: data.content,
      sourceUrl: data.sourceUrl,
      tags: data.tags ?? [],
      type: data.type ?? null,
    },
  });

  revalidatePath("/inspirations");
}

export async function deleteInspiration(id: string) {
  await prisma.inspiration.delete({ where: { id } });
  revalidatePath("/inspirations");
}

export async function updateInspiration(
  id: string,
  data: {
    title?: string;
    content?: any;
    sourceUrl?: string | null;
    tags?: string[];
    type?: string | null;
  }
) {
  await prisma.inspiration.update({
    where: { id },
    data,
  });

  revalidatePath("/inspirations"); // adjust if your page path differs
}