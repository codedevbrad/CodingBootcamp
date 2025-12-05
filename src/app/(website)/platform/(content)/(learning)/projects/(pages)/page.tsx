"use client";

import * as React from "react";

/* ---------------------------------- Types --------------------------------- */
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category = "Fullstack" | "Frontend" | "Backend";
type Language =
  | "TypeScript"
  | "JavaScript"
  | "Python"
  | "SQL"
  | "NoSQL"
  | "GraphQL";

type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  estHours: number;
  progress: number; // 0–100
  tags: string[];
  languages: Language[];
  gradient: string;
  updatedAt: string;
  featured?: boolean;
};

/* ------------------------------- Fake Dataset ------------------------------ */
const PROJECTS: Project[] = [
  {
    id: "p-001",
    slug: "fullstack-feedback-hub",
    title: "Fullstack Feedback Hub",
    description:
      "Users can submit feedback, upvote, comment, and admins can triage with statuses.",
    category: "Fullstack",
    difficulty: "Intermediate",
    estHours: 18,
    progress: 35,
    tags: ["auth", "crud", "filters"],
    languages: ["TypeScript", "SQL"],
    gradient: "from-cyan-500/10 to-blue-500/10",
    updatedAt: "2025-10-20T10:00:00.000Z",
    featured: true,
  },
  {
    id: "p-002",
    slug: "frontend-landing-hero",
    title: "Frontend Landing Page",
    description:
      "Responsive hero section, CTA grid, and footer built with Tailwind and ShadCN.",
    category: "Frontend",
    difficulty: "Beginner",
    estHours: 6,
    progress: 100,
    tags: ["ui", "responsive"],
    languages: ["TypeScript"],
    gradient: "from-fuchsia-500/10 to-rose-500/10",
    updatedAt: "2025-10-10T12:12:00.000Z",
  },
  {
    id: "p-003",
    slug: "backend-webhooks-ingest",
    title: "Backend Webhook Service",
    description:
      "Ingest and verify webhook events, handle retries with backoff and dead-letter queues.",
    category: "Backend",
    difficulty: "Advanced",
    estHours: 14,
    progress: 20,
    tags: ["security", "queues", "api"],
    languages: ["TypeScript", "Python"],
    gradient: "from-red-500/10 to-rose-500/10",
    updatedAt: "2025-10-21T14:05:00.000Z",
  },
  {
    id: "p-004",
    slug: "fullstack-quiz-engine",
    title: "Fullstack Quiz Engine",
    description:
      "Authoring UI for coding challenges, auto-grading logic, and progress analytics.",
    category: "Fullstack",
    difficulty: "Advanced",
    estHours: 20,
    progress: 10,
    tags: ["grading", "react", "api"],
    languages: ["TypeScript", "SQL"],
    gradient: "from-amber-500/10 to-orange-500/10",
    updatedAt: "2025-10-11T10:20:00.000Z",
  },
  {
    id: "p-005",
    slug: "frontend-dashboard",
    title: "Frontend Dashboard",
    description:
      "Analytics dashboard with charts, cards, and tabs built using ShadCN and Chart.js.",
    category: "Frontend",
    difficulty: "Intermediate",
    estHours: 10,
    progress: 70,
    tags: ["charts", "ux", "state"],
    languages: ["TypeScript"],
    gradient: "from-lime-500/10 to-emerald-500/10",
    updatedAt: "2025-10-05T13:41:00.000Z",
  },
  {
    id: "p-006",
    slug: "backend-api-gateway",
    title: "Backend API Gateway",
    description:
      "Centralized gateway handling routing, rate-limiting, and authentication.",
    category: "Backend",
    difficulty: "Intermediate",
    estHours: 16,
    progress: 40,
    tags: ["microservices", "gateway"],
    languages: ["TypeScript", "NoSQL"],
    gradient: "from-blue-500/10 to-indigo-500/10",
    updatedAt: "2025-10-15T16:33:00.000Z",
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
];
const CATEGORIES: Category[] = ["Fullstack", "Frontend", "Backend"];
const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

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
export default function ProjectsPage() {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<"All" | Category>("All");
  const [diff, setDiff] = React.useState<"All" | Difficulty>("All");
  const [selectedLangs, setSelectedLangs] = React.useState<Set<Language>>(
    new Set()
  );

  function toggleLang(l: Language) {
    setSelectedLangs((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  }

  const filtered = React.useMemo(() => {
    return PROJECTS.filter((p) => {
      const qq = query.trim().toLowerCase();
      const matchesQuery =
        qq.length === 0 ||
        p.title.toLowerCase().includes(qq) ||
        p.description.toLowerCase().includes(qq) ||
        p.tags.some((t) => t.toLowerCase().includes(qq));
      const matchesCat = cat === "All" || p.category === cat;
      const matchesDiff = diff === "All" || p.difficulty === diff;
      const matchesLangs =
        selectedLangs.size === 0 ||
        [...selectedLangs].every((l) => p.languages.includes(l));
      return matchesQuery && matchesCat && matchesDiff && matchesLangs;
    });
  }, [query, cat, diff, selectedLangs]);

  return (
    <main className="min-h-screen px-4 md:px-8 py-10">
      <section className="max-w-6xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-block h-2 w-2 rounded-full bg-black/60 dark:bg-white/80" />
          <span className="text-sm opacity-70">Bootcamp</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Projects
        </h1>
        <p className="opacity-70 mt-2">
          Fullstack, Frontend, and Backend projects to level up your skills.
        </p>

        {/* Controls */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects or #tags…"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as any)}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={diff}
                onChange={(e) => setDiff(e.target.value as any)}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2"
              >
                <option value="All">All Levels</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
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

      {/* Project Cards */}
      <section className="max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <div className="opacity-70 py-20 text-center">
            No projects match those filters… try widening your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <article
                key={p.id}
                className={cls(
                  "relative rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br",
                  p.gradient,
                  "p-4"
                )}
              >
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                    {p.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                    {p.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="text-sm opacity-80 mt-1 line-clamp-3">
                  {p.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.languages.map((lang) => (
                    <span
                      key={lang}
                      className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <ProgressBar value={p.progress} />
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>{p.progress}% complete</span>
                    <span>~{p.estHours}h</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={`/platform/projects/${p.slug}`}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm"
                  >
                    {p.progress > 0 && p.progress < 100 ? "Resume" : "Start"}
                  </a>
                  <button
                    className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 text-sm"
                    onClick={() => alert(`Previewing: ${p.title}`)}
                  >
                    Preview
                  </button>
                </div>

                <div className="mt-3 text-[10px] opacity-60">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 