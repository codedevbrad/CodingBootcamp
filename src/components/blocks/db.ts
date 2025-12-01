"use server";

import { prisma} from "@/lib/db/prisma";
import type { animatedCodeChallengeBlock } from "./animatedCode/package/package.types";

import type { QuizBlock } from "@/components/blocks/quiz/package/quiz.types";

// Generic Type for any block data
export type AnyBlockData = animatedCodeChallengeBlock | QuizBlock | any;

/* --------------------------- CREATE ---------------------------- */

export async function createBlock(type: string, data: AnyBlockData) {
  return prisma.block.create({
    data: {
      type,
      title: data.title,
      description: data.description || null,
      summary: data.summary || null,
      data,
    },
  });
}

/* ---------------------------- UPDATE --------------------------- */

export async function updateBlock(id: string, data: AnyBlockData) {
  return prisma.block.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      summary: data.summary || null,
      data,
    },
  });
}

/* ---------------------------- DELETE --------------------------- */

export async function deleteBlock(id: string) {
  return prisma.block.delete({
    where: { id },
  });
}


/* ---------------------------- LIST ------------------------------ */

export async function getBlocks() {
  return prisma.block.findMany({
    orderBy: { createdAt: "desc" },
  });
}
