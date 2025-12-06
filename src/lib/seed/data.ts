  /* -------------------------- DIFFICULTY SEED -------------------------- */
  export const difficulties = [
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
  export const languages = [
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
  export const categories = [
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