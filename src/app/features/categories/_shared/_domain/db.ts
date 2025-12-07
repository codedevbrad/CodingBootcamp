"use server";

import { prisma } from "@/lib/db/prisma";

export async function getCategories() {
  return prisma.category.findMany();
}
