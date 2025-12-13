"use client";

import * as React from "react";
import Link from "next/link";
import { useProjects } from "../contexts/useProjects";

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

export default function ProjectsList() {
  const { data: projects, isLoading, error } = useProjects();
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<string>("All");
  const [diff, setDiff] = React.useState<string>("All");
  const [selectedLangs, setSelectedLangs] = React.useState<Set<string>>(
    new Set()
  );

  // Extract unique categories, difficulties, and languages from projects
  const categories = React.useMemo(() => {
    if (!projects) return [];
    const cats = new Set<string>();
    projects.forEach((p) => {
      p.categories?.forEach((pc) => {
        if (pc.category?.title) cats.add(pc.category.title);
      });
    });
    return Array.from(cats);
  }, [projects]);

  const difficulties = React.useMemo(() => {
    if (!projects) return [];
    const diffs = new Set<string>();
    projects.forEach((p) => {
      if (p.difficulty?.title) diffs.add(p.difficulty.title);
    });
    return Array.from(diffs);
  }, [projects]);

  const languages = React.useMemo(() => {
    if (!projects) return [];
    const langs = new Set<string>();
    projects.forEach((p) => {
      p.languages?.forEach((pl) => {
        if (pl.language?.title) langs.add(pl.language.title);
      });
    });
    return Array.from(langs);
  }, [projects]);

  function toggleLang(l: string) {
    setSelectedLangs((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  }

  const filtered = React.useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      const qq = query.trim().toLowerCase();
      const matchesQuery =
        qq.length === 0 ||
        p.title.toLowerCase().includes(qq) ||
        (p.description || "").toLowerCase().includes(qq) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(qq));
      
      const matchesCat =
        cat === "All" ||
        p.categories?.some((pc) => pc.category?.title === cat);
      
      const matchesDiff =
        diff === "All" || p.difficulty?.title === diff;
      
      const matchesLangs =
        selectedLangs.size === 0 ||
        [...selectedLangs].every((l) =>
          p.languages?.some((pl) => pl.language?.title === l)
        );
      
      return matchesQuery && matchesCat && matchesDiff && matchesLangs;
    });
  }, [projects, query, cat, diff, selectedLangs]);

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 md:px-8 py-10">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="opacity-70">Loading projects...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 md:px-8 py-10">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-red-500">Failed to load projects</p>
        </div>
      </main>
    );
  }

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
                onChange={(e) => setCat(e.target.value)}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={diff}
                onChange={(e) => setDiff(e.target.value)}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2"
              >
                <option value="All">All Levels</option>
                {difficulties.map((d) => (
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
            {languages.map((l) => (
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
            {filtered.map((p) => {
              const gradient = p.color || "from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800";
              const progress = 0; // TODO: Calculate from student progress
              const categoryTitle = p.categories?.[0]?.category?.title || "Uncategorized";
              const difficultyTitle = p.difficulty?.title || "Unknown";
              
              return (
                <article
                  key={p.id}
                  className={cls(
                    "relative rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br",
                    gradient,
                    "p-4"
                  )}
                >
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                      {categoryTitle}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                      {difficultyTitle}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="text-sm opacity-80 mt-1 line-clamp-3">
                    {p.description || "No description available."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(p.tags || []).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(p.languages || []).map((pl) => (
                      <span
                        key={pl.language?.id}
                        className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
                      >
                        {pl.language?.title}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    <ProgressBar value={progress} />
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>{progress}% complete</span>
                      <span>~{p.estHours}h</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/platform/projects/project/${p.slug}`}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm"
                    >
                      {progress > 0 && progress < 100 ? "Resume" : "Start"}
                    </Link>
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
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

