import { prisma  } from "@/lib/db/prisma"; 


export type UIChallenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estMins: number;
  progress: number;
  tags: string[];
  recommended: boolean;
  languages: string[];
  updatedAt: string;
};

export type UIChallengeSubGroup = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  challenges: UIChallenge[];
};

export type UIChallengeGroup = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  color: string;
  challenges: UIChallenge[];
  subgroups: UIChallengeSubGroup[];
};


export async function getChallengeGroupsUI(): Promise<UIChallengeGroup[]> {
  const groups = await prisma.challengeGroup.findMany({
    include: {
      challenges: {
        include: {
          category: true,
          difficulty: true,
          languages: { include: { language: true } },
        },
        orderBy: [{ recommended: "desc" }, { updatedAt: "desc" }],
      },

      subgroups: {
        include: {
          challenges: {
            include: {
              category: true,
              difficulty: true,
              languages: { include: { language: true } },
            },
            orderBy: [{ recommended: "desc" }, { updatedAt: "desc" }],
          },
        },
        orderBy: { title: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });

  const mapChallenge = (c: any): UIChallenge => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    category: c.category?.title || "Uncategorised",
    difficulty: c.difficulty?.title || "Unknown",
    estMins: c.estMins,
    recommended: c.recommended,
    tags: c.tags,
    languages: c.languages.map((x: any) => x.language.title),
    progress: 0,
    updatedAt: c.updatedAt.toISOString(),
  });

  return groups.map((g) => ({
    id: g.id,
    key: g.key,
    title: g.title,
    description: g.description,
    color: g.color ?? "from-black/5 to-black/10",

    challenges: g.challenges.map(mapChallenge),

    // ⭐ Filter out only subgroups that have challenges
    subgroups: g.subgroups
      .filter((sg) => sg.challenges.length > 0)
      .map((sg) => ({
        id: sg.id,
        key: sg.key,
        title: sg.title,
        description: sg.description,
        challenges: sg.challenges.map(mapChallenge),
      })),
  }));
}

