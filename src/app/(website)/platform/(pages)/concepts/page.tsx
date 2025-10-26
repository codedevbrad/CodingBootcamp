"use client";

import * as React from "react";

/* ---------------------------------- Types --------------------------------- */
import type { Difficulty , Category , Language , TopicStatus , Topic , Concept } from "./uses/_types"


/* ------------------------------- Fake Dataset ------------------------------ */
const CONCEPTS: Concept[] = [
  {
    id: "cx-001",
    slug: "react-state-basics",
    title: "React State & Effects",
    description:
      "Understand state lifecycles, controlled inputs, effects, and cleanup patterns.",
    category: "Frontend",
    difficulty: "Beginner",
    languages: ["TypeScript", "JavaScript"],
    gradient: "from-cyan-500/10 to-blue-500/10",
    updatedAt: "2025-10-20T10:00:00.000Z",
    tags: ["react", "hooks", "state"],
    featured: true,
    topics: [
      { id: "t1", slug: "use-state-fundamentals", title: "useState fundamentals", estMins: 8, status: "Completed" },
      { id: "t2", slug: "derived-state-pitfalls", title: "Derived state & pitfalls", estMins: 7, status: "Ready" },
      { id: "t3", slug: "use-effect-lifecycle", title: "useEffect lifecycle & cleanup", estMins: 10, status: "Ready" },
      { id: "t4", slug: "controlled-vs-uncontrolled", title: "Controlled vs uncontrolled inputs", estMins: 6, status: "Ready" },
      { id: "t5", slug: "avoiding-re-renders", title: "Avoiding re-renders", estMins: 9, status: "Locked" },
    ],
  },
  {
    id: "cx-002",
    slug: "api-design-rest",
    title: "REST API Design",
    description:
      "Design resourceful APIs with versioning, pagination, auth, and validation.",
    category: "Backend",
    difficulty: "Intermediate",
    languages: ["TypeScript", "Python"],
    gradient: "from-amber-500/10 to-orange-500/10",
    updatedAt: "2025-10-18T13:40:00.000Z",
    tags: ["api", "pagination", "auth"],
    topics: [
      { id: "t1", slug: "resources-and-nouns", title: "Resources & nouns, not verbs", estMins: 6, status: "Completed" },
      { id: "t2", slug: "filters-and-pagination", title: "Filtering, sorting, pagination", estMins: 8, status: "Ready" },
      { id: "t3", slug: "auth-vs-authorization", title: "Auth vs authorization", estMins: 7, status: "Ready" },
      { id: "t4", slug: "validation-error-shapes", title: "Validation & error shapes", estMins: 6, status: "Ready" },
    ],
  },
  {
    id: "cx-003",
    slug: "database-indexing",
    title: "Database Indexing 101",
    description:
      "How B-Trees work, composite indexes, selectivity, and avoiding over-indexing.",
    category: "Database",
    difficulty: "Intermediate",
    languages: ["SQL"],
    gradient: "from-violet-500/10 to-purple-500/10",
    updatedAt: "2025-10-11T09:02:00.000Z",
    tags: ["sql", "performance", "indexes"],
    topics: [
      { id: "t1", slug: "btree-intuition", title: "B-Tree intuition", estMins: 7, status: "Ready" },
      { id: "t2", slug: "composite-index-order", title: "Composite indexes & order", estMins: 8, status: "Ready" },
      { id: "t3", slug: "covering-indexes", title: "Covering indexes", estMins: 6, status: "Locked" },
      { id: "t4", slug: "index-selectivity", title: "Index selectivity", estMins: 6, status: "Ready" },
      { id: "t5", slug: "when-not-to-index", title: "When NOT to index", estMins: 6, status: "Ready" },
    ],
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
const CATEGORIES: Category[] = ["Frontend", "Backend", "System Design", "Database"];
const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

/* ------------------------------- UI Helpers -------------------------------- */
function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}
function conceptProgress(topics: Topic[]) {
  const done = topics.filter((t) => t.status === "Completed").length;
  return Math.round((done / Math.max(1, topics.length)) * 100);
}
function totalMins(topics: Topic[]) {
  return topics.reduce((a, b) => a + b.estMins, 0);
}
function StatusDot({ status }: { status: TopicStatus }) {
  const tone =
    status === "Completed"
      ? "bg-black dark:bg-white"
      : status === "Locked"
      ? "bg-black/20 dark:bg-white/30"
      : "bg-black/60 dark:bg-white/70";
  return <span className={cls("inline-block h-2.5 w-2.5 rounded-full", tone)} />;
}

function TopicRow({
  topic,
  conceptSlug,
}: {
  topic: Topic;
  conceptSlug: string;
}) {
  const isLocked = topic.status === "Locked";
  const isDone = topic.status === "Completed";
  return (
    <div
      className={cls(
        "group rounded-xl px-3 py-2",
        "bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10",
        isLocked && "opacity-60"
      )}
      aria-label={`${topic.title} — ${topic.estMins} minutes — ${topic.status}`}
    >
      <div className="flex items-center gap-3">
        <StatusDot status={topic.status} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cls("truncate text-sm font-medium", isDone && "line-through")}>
              {topic.title}
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
              {topic.estMins}m
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <div
              className={cls(
                "h-full rounded-full transition-all",
                isDone ? "bg-black dark:bg-white w-full" : "bg-black/40 dark:bg-white/70 w-1/5 group-hover:w-1/3"
              )}
            />
          </div>
        </div>

        {/* Topic button link */}
        <a
          href={`/platform/concepts/${conceptSlug}/${topic.slug}`}
          className={cls(
            "text-xs px-2 py-1 rounded-lg border border-black/10 dark:border-white/10",
            "bg-white/70 dark:bg-white/5 hover:bg-white"
          )}
          onClick={(e) => {
            if (isLocked) {
              e.preventDefault();
              alert("This topic is locked.");
            }
          }}
        >
          Open
        </a>
      </div>
    </div>
  );
}

/* --------------------------------- Page UI -------------------------------- */
export default function ConceptsPage() {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<"All" | Category>("All");
  const [diff, setDiff] = React.useState<"All" | Difficulty>("All");
  const [selectedLangs, setSelectedLangs] = React.useState<Set<Language>>(new Set());

  function toggleLang(l: Language) {
    setSelectedLangs((prev) => {
      const next = new Set(prev);
      next.has(l) ? next.delete(l) : next.add(l);
      return next;
    });
  }

  const filtered = React.useMemo(() => {
    return CONCEPTS.filter((c) => {
      const qq = query.trim().toLowerCase();
      const matchesQuery =
        qq.length === 0 ||
        c.title.toLowerCase().includes(qq) ||
        c.description.toLowerCase().includes(qq) ||
        c.tags.some((t) => t.toLowerCase().includes(qq)) ||
        c.topics.some((t) => t.title.toLowerCase().includes(qq));
      const matchesCat = cat === "All" || c.category === cat;
      const matchesDiff = diff === "All" || c.difficulty === diff;
      const matchesLangs =
        selectedLangs.size === 0 || [...selectedLangs].every((l) => c.languages.includes(l));
      return matchesQuery && matchesCat && matchesDiff && matchesLangs;
    });
  }, [query, cat, diff, selectedLangs]);

  return (
    <main className="min-h-screen px-4 md:px-8 py-10">
      {/* Header */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-block h-2 w-2 rounded-full bg-black/60 dark:bg-white/80" />
          <span className="text-sm opacity-70">Bootcamp</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Concepts</h1>
        <p className="opacity-70 mt-2">
          Bite-size theory with guided topics. Use the buttons to view a concept or open a specific topic.
        </p>

        {/* Controls */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search concepts, topics, or #tags…"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
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
            </div>
          </div>

          {/* Language pills */}
          <div className="flex flex-wrap gap-2">
            <LangPill active={selectedLangs.size === 0} onClick={() => setSelectedLangs(new Set())}>
              Any Language
            </LangPill>
            {ALL_LANGUAGES.map((l) => (
              <LangPill key={l} active={selectedLangs.has(l)} onClick={() => toggleLang(l)}>
                {l}
              </LangPill>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="opacity-70 py-20 text-center">
            No concepts match those filters… try widening your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const pct = conceptProgress(c.topics);
              const count = c.topics.length;
              const mins = totalMins(c.topics);
              const preview = c.topics.slice(0, 4);
              const hidden = Math.max(0, c.topics.length - preview.length);

              return (
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
                    {c.featured && (
                      <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-black/80 text-white dark:bg-white dark:text-black">
                        Featured
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                      {c.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                      {c.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10">
                      {count} topic{count > 1 ? "s" : ""} • ~{mins}m
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <p className="text-sm opacity-80 mt-1 line-clamp-3">{c.description}</p>

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

                  {/* topics — polished preview with buttons */}
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-wide opacity-70 mb-2">
                      Topics preview
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {preview.map((t) => (
                        <TopicRow key={t.id} topic={t} conceptSlug={c.slug} />
                      ))}
                      {hidden > 0 && (
                        <div className="text-xs opacity-70">
                          +{hidden} more topic{hidden > 1 ? "s" : ""} • View concept to see all
                        </div>
                      )}
                    </div>
                  </div>

                  {/* slim progress */}
                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-black/70 dark:bg-white/80"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs opacity-70 mt-1.5">
                      <span>{pct}% complete</span>
                      <span>
                        {c.topics.filter((t) => t.status === "Completed").length}/{count} done
                      </span>
                    </div>
                  </div>

                  {/* concept button link */}
                  <div className="mt-4">
                    <a
                      href={`/platform/concepts/${c.slug}`}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm"
                    >
                      View concept
                    </a>
                  </div>

                  <div className="mt-3 text-[10px] opacity-60">
                    Updated {new Date(c.updatedAt).toLocaleDateString()}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

/* ------------------------------- Small UI --------------------------------- */
function LangPill({
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
