"use server";

import { prisma } from "@/lib/db/prisma";


/* ----------------------------------------------------
   GET GROUP BY ID (with subgroups + all challenge data)
---------------------------------------------------- */
export async function getChallengeGroupById({ id }: { id: string }) {
  return prisma.challengeGroup.findUnique({
    where: { id },
    include: {
      subgroups: {
        orderBy: { title: "asc" },
        include: {
          challenges: {
            include: {
              category: true,
              difficulty: true,
              subGroup: true,
              languages: { include: { language: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },

      challenges: {
        include: {
          category: true,
          difficulty: true,
          subGroup: true,
          languages: {
            include: { language: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}



/* ----------------------------------------------------
   GET ALL GROUPS WITH CHALLENGES & SUBGROUPS
---------------------------------------------------- */
export async function getChallengeGroupsWithRelations() {
  return prisma.challengeGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subgroups: {
        orderBy: { title: "asc" },
        include: {
          challenges: {
            include: {
              category: true,
              difficulty: true,
              subGroup: true,
              languages: { include: { language: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },

      challenges: {
        include: {
          category: true,
          difficulty: true,
          subGroup: true,
          languages: { include: { language: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}



/* ----------------------------------------------------
   GROUP CRUD
---------------------------------------------------- */
export async function createChallengeGroup(data: {
  key: string;
  title: string;
  description?: string;
  color?: string;
}) {
  return prisma.challengeGroup.create({
    data,
  });
}

export async function updateChallengeGroup(
  id: string,
  data: {
    key: string;
    title: string;
    description?: string;
    color?: string;
  },
) {
  return prisma.challengeGroup.update({
    where: { id },
    data,
  });
}

export async function deleteChallengeGroup(id: string) {
  return prisma.challengeGroup.delete({
    where: { id },
  });
}



/* ----------------------------------------------------
   CREATE CHALLENGE
---------------------------------------------------- */
export async function createChallenge(groupId: string, data: any) {
  const created = await prisma.challenge.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      estMins: data.estMins,

      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags.split(",").map((t: string) => t.trim()),

      work: {},
      guide: {},

      workType: data.workType || "CODE",

      groupId,
      subGroupId: data.subGroupId || null,

      categoryId: data.categoryId,
      difficultyId: data.difficultyId,

      languages: {
        create: data.languageIds.map((id) => ({
          languageId: id,
        })),
      },
    },

    include: {
      category: true,
      difficulty: true,
      subGroup: true,
      languages: { include: { language: true } },
    },
  });

  return created;
}



/* ----------------------------------------------------
   UPDATE CHALLENGE
---------------------------------------------------- */
export async function updateChallenge(id: string, data: any) {
  // clear languages
  await prisma.challengeLanguage.deleteMany({
    where: { challengeId: id },
  });

  const updated = await prisma.challenge.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      estMins: data.estMins,

      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags.split(",").map((t: string) => t.trim()),

      workType: data.workType || "CODE",

      categoryId: data.categoryId,
      difficultyId: data.difficultyId,

      subGroupId: data.subGroupId || null,

      languages: {
        create: data.languageIds.map((lid) => ({
          languageId: lid,
        })),
      },
    },

    include: {
      category: true,
      difficulty: true,
      subGroup: true,
      languages: { include: { language: true } },
    },
  });

  return updated;
}



/* ----------------------------------------------------
   DELETE CHALLENGE
---------------------------------------------------- */
export async function deleteChallenge(id: string) {
  return prisma.challenge.delete({ where: { id } });
}



/* ----------------------------------------------------
   SUBGROUP CRUD
---------------------------------------------------- */
export async function createSubGroup(
  groupId: string,
  data: { title: string; description?: string; key: string },
) {
  return prisma.challengeSubGroup.create({
    data: {
      groupId,
      title: data.title,
      description: data.description,
      key: data.key,
    },
  });
}

export async function updateSubGroup(
  id: string,
  data: { title: string; description?: string; key: string },
) {
  return prisma.challengeSubGroup.update({
    where: { id },
    data,
  });
}

export async function deleteSubGroup(id: string) {
  return prisma.challengeSubGroup.delete({
    where: { id },
  });
}



/* ----------------------------------------------------
   GET SUBGROUPS FOR A GROUP
---------------------------------------------------- */
export async function getSubGroupsForGroup(groupId: string) {
  return prisma.challengeSubGroup.findMany({
    where: { groupId },
    orderBy: { title: "asc" },
    include: {
      challenges: {
        include: {
          category: true,
          difficulty: true,
          subGroup: true,
          languages: { include: { language: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}


/* ----------------------------------------------------
   GET CHALLENGE BY ID (with relations)
   ---------------------------------------------------- */

export async function getChallengeById( challengeId: string) {
  return prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      category: true,
      difficulty: true,
      subGroup: true,
      group: true,
      languages: { include: { language: true } },
    },
  });
}


/* ----------------------------------------------------
   GET CHALLENGE BY SLUG (with relations)
   ---------------------------------------------------- */

export async function getChallengeBySlug( slug: string) {
  return prisma.challenge.findUnique({
    where: { slug },
    include: {
      category: true,
      difficulty: true,
      subGroup: true,
      group: true,
      languages: { include: { language: true } },
    },
  });
}



/* ----------------------------------------------------
                UPDATE CHALLENGE WORK TYPE
   ---------------------------------------------------- */

export async function updateChallengeWorkType(id: string, workType: "CODE" | "EXERCISE" | "DIAGRAM") {
  return prisma.challenge.update({
    where: { id },
    data: { workType },
  });
}



/* ----------------------------------------------------
               UPDATE CHALLENGE WORK JSON
   ---------------------------------------------------- */


export const db_updateTaskCodeData = async ({ id , data } : { id: string , data: any }) => {
    try {
        const taskData = await prisma.challenge.update({
            where: { id },
            data: {
                work: JSON.parse(JSON.stringify(data))
            }
        })
        return taskData
    }
    catch (error) {
        console.error('Error updating task data:', error)
        throw new Error('Failed to update task data')
    }
}