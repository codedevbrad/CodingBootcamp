"use server";

import { prisma } from "@/lib/db/prisma";

export async function getLanguages() {
  return prisma.language.findMany();
}