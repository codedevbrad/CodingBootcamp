"use server"

import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"

/* -------------------------------------------------------------
   LOAD TOPIC WITH BLOCKS
------------------------------------------------------------- */

export async function getTopicBySlugWithBlocks(id: string) {
  return prisma.topic.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { order: "asc" },
        include: { block: true },
      },
    },
  });
}

/* -------------------------------------------------------------
   SAVE TOPIC CONTENT (YOUR VERSION)
------------------------------------------------------------- */

export async function saveTopicContent(id: string, blockData: any) {
  await prisma.topic.update({
    where: { id },
    data: { content: blockData },
  });

  revalidatePath(`/dashboard/admin/topics/${id}/write`);
}

/* ------------------------------------------------------------------
   ATTACH A BLOCK TO A TOPIC
------------------------------------------------------------------ */

export async function attachManyBlocksToTopic(topicId: string, blockIds: string[]) {
  if (!blockIds || blockIds.length === 0) return [];

  const max = await prisma.topicBlock.aggregate({
    where: { topicId },
    _max: { order: true },
  });

  let nextOrder = (max._max.order ?? 0) + 1;

  // CreateMany WITHOUT ID (Prisma generates cuid)
  await prisma.topicBlock.createMany({
    data: blockIds.map((blockId) => ({
      topicId,
      blockId,
      order: nextOrder++,
    })),
  });

  // Fetch the newly attached blocks
  const result = await prisma.topicBlock.findMany({
    where: {
      topicId,
      blockId: { in: blockIds },
    },
    include: { block: true },
    orderBy: { order: "asc" },
  });

  revalidatePath(`/dashboard/admin/topics/${topicId}/write`);
  return result;
}


/* ------------------------------------------------------------------
   REMOVE BLOCK FROM TOPIC
------------------------------------------------------------------ */
export async function removeTopicBlock(id: string, topicId: string) {
  await prisma.topicBlock.delete({
    where: { id },
  });

  revalidatePath(`/dashboard/admin/topics/${topicId}/write`);
}