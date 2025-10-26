"use client";

import * as React from "react";

/* ---------------------------------- Types --------------------------------- */
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category =
  | "System Design"
  | "ERM"
  | "Coding"
  | "Diagram"
  | "Frontend"
  | "Backend"
  | "Algorithms";

type Language =
  | "TypeScript"
  | "JavaScript"
  | "Python"
  | "SQL"
  | "NoSQL"
  | "GraphQL"
  | "Go"
  | "Rust";

type Challenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  estMins: number; // estimated time
  progress: number; // 0–100
  tags: string[];
  languages: Language[]; // NEW
  gradient: string; // tailwind gradient utility
  updatedAt: string; // ISO
  recommended?: boolean;
};

/* ------------------------------- Fake Dataset ------------------------------ */
const CHALLENGES: Challenge[] = [
  {
    id: "c-001",
    slug: "design-url-shortener",
    title: "Design a URL Shortener",
    description:
      "Plan a scalable service for shortening and redirecting links with analytics.",
    category: "System Design",
    difficulty: "Intermediate",
    estMins: 45,
    progress: 0,
    tags: ["scaling", "database", "cache"],
    languages: ["TypeScript", "Go", "NoSQL"],
    gradient: "from-cyan-500/10 to-blue-500/10",
    updatedAt: "2025-10-20T10:00:00.000Z",
    recommended: true,
  },
  {
    id: "c-002",
    slug: "erm-music-streaming",
    title: "ERM: Music Streaming",
    description:
      "Model users, artists, albums, tracks, playlists, and follows with keys & relations.",
    category: "ERM",
    difficulty: "Beginner",
    estMins: 30,
    progress: 80,
    tags: ["pk/fk", "normalization"],
    languages: ["SQL"],
    gradient: "from-emerald-500/10 to-teal-500/10",
    updatedAt: "2025-10-18T09:12:00.000Z",
  },
  {
    id: "c-003",
    slug: "frontend-price-cards",
    title: "Frontend: Price Cards",
    description:
      "Build responsive pricing cards with toggle for monthly/yearly and feature checks.",
    category: "Frontend",
    difficulty: "Beginner",
    estMins: 25,
    progress: 100,
    tags: ["css", "responsive", "accessibility"],
    languages: ["TypeScript"],
    gradient: "from-fuchsia-500/10 to-rose-500/10",
    updatedAt: "2025-10-10T17:22:00.000Z",
  },
  {
    id: "c-004",
    slug: "design-chat-availability",
    title: "Design Live Chat + Availability",
    description:
      "Propose a system that routes users to available tutors with queueing & presence.",
    category: "System Design",
    difficulty: "Advanced",
    estMins: 60,
    progress: 10,
    tags: ["websocket", "queues", "load-balancing"],
    languages: ["TypeScript", "NoSQL", "Go"],
    gradient: "from-amber-500/10 to-orange-500/10",
    updatedAt: "2025-10-21T14:05:00.000Z",
    recommended: true,
  },
  {
    id: "c-005",
    slug: "erm-food-delivery",
    title: "ERM: Food Delivery",
    description:
      "Design tables for restaurants, menus, orders, couriers, and delivery tracking.",
    category: "ERM",
    difficulty: "Intermediate",
    estMins: 35,
    progress: 0,
    tags: ["relations", "indexes"],
    languages: ["SQL"],
    gradient: "from-violet-500/10 to-purple-500/10",
    updatedAt: "2025-10-12T11:03:00.000Z",
  },
  {
    id: "c-006",
    slug: "algorithms-scheduler",
    title: "Algorithms: Slot Scheduler",
    description:
      "Implement greedy/interval logic to assign sessions without overlap.",
    category: "Algorithms",
    difficulty: "Intermediate",
    estMins: 40,
    progress: 50,
    tags: ["greedy", "intervals", "sorting"],
    languages: ["TypeScript", "Python"],
    gradient: "from-sky-500/10 to-indigo-500/10",
    updatedAt: "2025-10-08T08:56:00.000Z",
  },
  {
    id: "c-007",
    slug: "frontend-kanban",
    title: "Frontend: Mini Kanban",
    description: "Create a drag-and-drop board with columns and persistence.",
    category: "Frontend",
    difficulty: "Intermediate",
    estMins: 50,
    progress: 20,
    tags: ["drag-drop", "state"],
    languages: ["TypeScript"],
    gradient: "from-lime-500/10 to-emerald-500/10",
    updatedAt: "2025-10-05T13:41:00.000Z",
  },
  {
    id: "c-008",
    slug: "backend-webhooks",
    title: "Backend: Webhooks Ingest",
    description:
      "Design a secure webhook ingestion pipeline with retries & signature checks.",
    category: "Backend",
    difficulty: "Advanced",
    estMins: 55,
    progress: 0,
    tags: ["security", "retries", "qos"],
    languages: ["TypeScript", "Python"],
    gradient: "from-red-500/10 to-rose-500/10",
    updatedAt: "2025-10-15T16:33:00.000Z",
  },
  {
    id: "c-009",
    slug: "algorithms-topk",
    title: "Algorithms: Top-K Stream",
    description: "Find the top-K frequent items in a stream efficiently.",
    category: "Algorithms",
    difficulty: "Advanced",
    estMins: 45,
    progress: 0,
    tags: ["heap", "hashmap"],
    languages: ["Python", "Rust"],
    gradient: "from-cyan-500/10 to-teal-500/10",
    updatedAt: "2025-09-29T10:00:00.000Z",
  },
  {
    id: "c-010",
    slug: "coding-eda-sql",
    title: "Coding: Explore Data with SQL",
    description:
      "Write SELECTs, JOINs, GROUP BY, and window functions on a sample dataset.",
    category: "Coding",
    difficulty: "Beginner",
    estMins: 35,
    progress: 60,
    tags: ["analytics", "joins", "window-fns"],
    languages: ["SQL"],
    gradient: "from-amber-500/10 to-yellow-500/10",
    updatedAt: "2025-10-11T10:20:00.000Z",
    recommended: true,
  },
  {
    id: "c-011",
    slug: "backend-file-uploads",
    title: "Backend: Signed Uploads",
    description:
      "Implement signed URL uploads to object storage with validation.",
    category: "Backend",
    difficulty: "Beginner",
    estMins: 25,
    progress: 0,
    tags: ["s3", "vercel-blob", "supabase"],
    languages: ["TypeScript"],
    gradient: "from-blue-500/10 to-indigo-500/10",
    updatedAt: "2025-10-19T10:20:00.000Z",
    recommended: true,
  },
  {
    id: "c-012",
    slug: "diagram-quiz-node",
    title: "Diagram: React Flow Quiz Node",
    description:
      "Build a React Flow node that validates answers and locks on wrong attempts.",
    category: "Diagram",
    difficulty: "Advanced",
    estMins: 40,
    progress: 5,
    tags: ["react-flow", "state", "validation"],
    languages: ["TypeScript"],
    gradient: "from-pink-500/10 to-fuchsia-500/10",
    updatedAt: "2025-10-07T09:01:00.000Z",
  },
];

/* ---------------------------- Filter Constants ----------------------------- */
const ALL_LANGUAGES: Language[] = [
  "TypeScript",
  "JavaScript",
  "Python",
  "SQL",
  "NoSQL",
  "GraphQL",
  "Go",
  "Rust",
];

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const CATEGORIES: Category[] = [
  "System Design",
  "ERM",
  "Coding",
  "Diagram",
  "Frontend",
  "Backend",
  "Algorithms",
];

/* ------------------------------- UI Helpers -------------------------------- */
function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-black/70 dark:bg-white/80 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function TogglePill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "px-3 py-1.5 rounded-full border text-sm transition",
        active
          ? "bg-black text-white dark:bg-white dark:text-black border-black/0"
          : "bg-white/70 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------------- Page UI -------------------------------- */
export default function ChallengesPage() {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<"All" | Category>("All");
  const [diff, setDiff] = React.useState<"All" | Difficulty>("All");
  const [selectedLangs, setSelectedLangs] = React.useState<Set<Language>>(
    new Set()
  );
  const [onlyRecommended, setOnlyRecommended] = React.useState(false);

  function toggleLang(l: Language) {
    setSelectedLangs((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  }

  const filtered = React.useMemo(() => {
    return CHALLENGES.filter((c) => {
      const matchesQuery =
        query.trim().length === 0 ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCat = cat === "All" || c.category === cat;
      const matchesDiff = diff === "All" || c.difficulty === diff;
      const matchesLangs =
        selectedLangs.size === 0 ||
        [...selectedLangs].every((l) => c.languages.includes(l));
      const matchesRec = !onlyRecommended || c.recommended;
      return (
        matchesQuery && matchesCat && matchesDiff && matchesLangs && matchesRec
      );
    }).sort((a, b) => Number(b.recommended) - Number(a.recommended));
  }, [query, cat, diff, selectedLangs, onlyRecommended]);

  return (
    <main className="min-h-screen px-4 md:px-8 py-10 z-0">
      {/* Header */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-block h-2 w-2 rounded-full bg-black/60 dark:bg-white/80" />
          <span className="text-sm opacity-70">Bootcamp</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Challenges
        </h1>
        <p className="opacity-70 mt-2">
          Mix of System Design, ERM, Coding, Diagram, Frontend, Backend, and
          Algorithms. Filter by category, difficulty, language, or tag.
        </p>

        {/* Controls */}
        <div className="mt-6 space-y-4">
          {/* Search row */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search challenges or #tags…"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Category */}
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as any)}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2"
                title="Category"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Difficulty */}
              <select
                value={diff}
                onChange={(e) => setDiff(e.target.value as any)}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2"
                title="Difficulty"
              >
                <option value="All">All Levels</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Recommended */}
              <button
                onClick={() => setOnlyRecommended((v) => !v)}
                className={cls(
                  "px-3 py-2 rounded-lg border transition",
                  onlyRecommended
                    ? "border-black/20 bg-black/80 text-white dark:bg-white dark:text-black"
                    : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
                )}
              >
                {onlyRecommended ? "Showing Recommended" : "All Challenges"}
              </button>
            </div>
          </div>

          {/* Language filter pills */}
          <div className="flex flex-wrap gap-2">
            <TogglePill
              active={selectedLangs.size === 0}
              onClick={() => setSelectedLangs(new Set())}
            >
              Any Language
            </TogglePill>
            {ALL_LANGUAGES.map((l) => (
              <TogglePill
                key={l}
                active={selectedLangs.has(l)}
                onClick={() => toggleLang(l)}
              >
                {l}
              </TogglePill>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="opacity-70 py-20 text-center">
            No challenges match those filters… try widening your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <article
                key={c.id}
                className={cls(
                  "relative rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br",
                  c.gradient,
                  "p-4"
                )}
              >
                {/* badges */}
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  {c.recommended && (
                    <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-black/80 text-white dark:bg-white dark:text-black">
                      Recommended
                    </span>
                  )}
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                    {c.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                    {c.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold">{c.title}</h3>
                <p className="text-sm opacity-80 mt-1 line-clamp-3">
                  {c.description}
                </p>

                {/* tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* languages */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.languages.map((lang) => (
                    <span
                      key={lang}
                      className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* progress + meta */}
                <div className="mt-4 space-y-2">
                  <ProgressBar value={c.progress} />
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>{c.progress}% complete</span>
                    <span>~{c.estMins} mins</span>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={`/platform/challenges/${c.slug}`}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm"
                  >
                    {c.progress > 0 && c.progress < 100 ? "Resume" : "Start"}
                  </a>
                  <button
                    className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 text-sm"
                    onClick={() => alert(`Previewing: ${c.title}`)}
                  >
                    Preview
                  </button>
                </div>

                <div className="mt-3 text-[10px] opacity-60">
                  Updated {new Date(c.updatedAt).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
