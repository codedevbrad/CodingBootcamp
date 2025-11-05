"use server";

import { prisma } from "@/lib/db/prisma";

export async function getUIInspirations() {
  const inspirations = await prisma.inspiration.findMany({
    where: { type: "ui" }, // 👈 or "ui-design", depending on your stored value
    orderBy: { createdAt: "desc" },
  });
  return inspirations;
}
