import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Difficulty, Language, Category...");

  /* -------------------------- DIFFICULTY SEED -------------------------- */
   const difficulties = [
    {
      key: "Beginner",
      title: "Beginner",
      description: "Best for new learners and simple challenge structures.",
      order: 1,
    },
    {
      key: "Intermediate",
      title: "Intermediate",
      description: "Moderate complexity — combines multiple concepts.",
      order: 2,
    },
    {
      key: "Advanced",
      title: "Advanced",
      description: "Deep system-level or algorithmic reasoning required.",
      order: 3,
    },
  ];

  /* ---------------------------- LANGUAGE SEED ---------------------------- */
  const languages = [
    { key: "TypeScript", title: "TypeScript", description: "Typed superset of JavaScript." },
    { key: "JavaScript", title: "JavaScript", description: "The language of the web." },
    { key: "Python", title: "Python", description: "High-level language great for algorithms." },
    { key: "SQL", title: "SQL", description: "Relational database query language." },
    { key: "NoSQL", title: "NoSQL", description: "Non-relational databases like MongoDB, DynamoDB, etc." },
    { key: "GraphQL", title: "GraphQL", description: "Strongly typed API query language." },
    { key: "Go", title: "Go", description: "High-performance server language." },
    { key: "Rust", title: "Rust", description: "Memory-safe low-level language." },
  ];

  /* ----------------------------- CATEGORY SEED ----------------------------- */
  
  const categories = [
        {
          key: "SystemDesign",
          title: "System Design",
          description: "Architecture, scalability, distributed systems, caching, queues.",
          icon: "system-design-icon",
          color: "blue",
        },
        {
          key: "ERM",
          title: "Entity Relationship Modelling",
          description: "Database schemas, relations, normalization, and indexing.",
          icon: "erm-icon",
          color: "emerald",
        },
        {
          key: "Coding",
          title: "Coding",
          description: "Implementation-focused programming challenges.",
          icon: "coding-icon",
          color: "yellow",
        },
        {
          key: "Diagram",
          title: "Diagram",
          description: "React Flow and visual system diagrams.",
          icon: "diagram-icon",
          color: "pink",
        },
        {
          key: "Frontend",
          title: "Frontend",
          description: "UI development, accessibility, animations, components.",
          icon: "frontend-icon",
          color: "fuchsia",
        },
        {
          key: "Backend",
          title: "Backend",
          description: "APIs, auth, storage, webhooks, infra.",
          icon: "backend-icon",
          color: "orange",
        },
        {
          key: "Algorithms",
          title: "Algorithms",
          description: "Greedy, intervals, recursion, heaps, and DSAs.",
          icon: "algorithms-icon",
          color: "purple",
        },
    ];

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
