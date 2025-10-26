"use server";

import { Concept, Topic } from "../uses/_types";

/** Optional: tiny delay to simulate network */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Server Action: pretend-fetch a concept by slug */
export async function getConceptBySlugSA(slug: string): Promise<Concept | null> {
  await delay(250);

  // Build a dummy concept that echoes the slug so it's obvious it's "fetched"
  const topics: Topic[] = [
    { id: "t1", slug: "intro",        title: "Introduction & goals",      estMins: 5,  status: "Completed" },
    { id: "t2", slug: "core-ideas",   title: "Core ideas in practice",     estMins: 8,  status: "Ready" },
    { id: "t3", slug: "hands-on",     title: "Hands-on mini exercise",     estMins: 10, status: "Ready" },
    { id: "t4", slug: "extras",       title: "Extras & references",        estMins: 6,  status: "Locked" },
  ];

  const concept: Concept = {
    id: "cx-dummy",
    slug,
    title: `Demo Concept: ${slug.replace(/-/g, " ")}`,
    description:
      "This is a demo concept loaded via a server action. Replace this with your real DB fetch.",
    category: "Frontend",
    difficulty: "Beginner",
    languages: ["TypeScript", "JavaScript"],
    gradient: "from-cyan-500/10 to-blue-500/10",
    updatedAt: new Date().toISOString(),
    tags: ["demo", "server-action", "concept"],
    topics,
    featured: true,
  };

  // For a 404 demo, uncomment:
  // if (slug === "missing") return null;

  return concept;
}
