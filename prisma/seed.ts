import { PrismaClient } from "@prisma/client"
import { difficulties, languages, categories } from "@/lib/seed/data"

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Difficulty, Language, Category...");



  for (const d of difficulties) {
    await prisma.difficulty.upsert({
      where: { key: d.key },
      update: {},
      create: d,
    });
  }



  for (const lang of languages) {
    await prisma.language.upsert({
      where: { key: lang.key },
      update: {},
      create: lang,
    });
  }



  for (const cat of categories) {
    await prisma.category.upsert({
      where: { key: cat.key },
      update: {},
      create: cat,
    });
  }

  /* ------------------------ CHALLENGE GROUP SEED ------------------------ */
  console.log("🌱 Seeding Challenge Groups...");

  const groups = [
    {
      key: "javascript-fundamentals",
      title: "JavaScript Fundamentals",
      description:
        "Master core concepts of JavaScript including variables, functions, arrays, objects, and the event loop.",
      color: "from-yellow-500/10 to-amber-500/10",
    },
    {
      key: "react-basics",
      title: "React.js Basics",
      description:
        "Learn components, props, state, lifecycle, hooks, and how to structure React applications.",
      color: "from-blue-500/10 to-indigo-500/10",
    },
    {
      key: "node-foundations",
      title: "Node.js Foundations",
      description:
        "Understand Node architecture, modules, async patterns, Express, and backend fundamentals.",
      color: "from-green-500/10 to-emerald-500/10",
    },
    {
      key: "nextjs-core",
      title: "Next.js Core Concepts",
      description:
        "Explore the App Router, server components, routing, layouts, data fetching, and deployment patterns.",
      color: "from-purple-500/10 to-fuchsia-500/10",
    },
    {
      key: "api-design",
      title: "API Design & Architecture",
      description:
        "Build REST APIs, validate inputs, structure routes, and follow clean API design principles.",
      color: "from-cyan-500/10 to-teal-500/10",
    },
    {
      key: "authentication-security",
      title: "Authentication & Security",
      description:
        "Implement secure auth using JWTs, OAuth, Clerk, sessions, hashing, and role-based authorization.",
      color: "from-rose-500/10 to-pink-500/10",
    },
    {
      key: "system-design",
      title: "System Design",
      description:
        "Design scalable systems with caching, load balancing, queues, databases, and distributed patterns.",
      color: "from-sky-500/10 to-blue-700/10",
    },
  ];

  for (const g of groups) {
    await prisma.challengeGroup.upsert({
      where: { key: g.key },
      update: {},
      create: g,
    });
  }

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
