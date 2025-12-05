"use client"
import * as React from "react"
import { useConcepts } from "../utils/util.useConcepts"
import { conceptProgress, totalMins, cls, LangPill, TopicRow } from "./components"

export default function ConceptsPage() {
  const { concepts, isLoading } = useConcepts();

  const [query, setQuery] = React.useState("");
  const [selectedLangs, setSelectedLangs] = React.useState(new Set<string>());

  function toggleLang(l: string) {
    setSelectedLangs((prev) => {
      const next = new Set(prev);
      next.has(l) ? next.delete(l) : next.add(l);
      return next;
    });
  }

  if (isLoading)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="opacity-60">Loading concepts...</p>
      </main>
    );

  /* ------------------------------------------------------
      FORMAT DB → PLATFORM UI SHAPE
  ------------------------------------------------------ */
  const formatted = concepts.map((c: any) => {
    const languages = [
      ...new Set(
        c.topics.flatMap((t: any) =>
          t.languages.map((l: any) => l.language.title)
        )
      ),
    ];

    return {
      id: c.id,
      key: c.key, // ✅ correct routing
      title: c.title,
      description: c.description ?? "",
      updatedAt: c.updatedAt,
      gradient: "from-slate-200 to-slate-300",

      languages,

      topics: c.topics.map((t: any) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        estMins: t.estMins ?? 5,
        status: t.recommended ? "Completed" : "Ready",
      })),
    };
  });

  /* ------------------------------------------------------
      FILTERING LOGIC
  ------------------------------------------------------ */
  const filtered = formatted.filter((c) => {
    const qq = query.trim().toLowerCase();

    const matchesQuery =
      qq.length === 0 ||
      c.title.toLowerCase().includes(qq) ||
      c.description.toLowerCase().includes(qq) ||
      c.topics.some((t) => t.title.toLowerCase().includes(qq));

    const matchesLangs =
      selectedLangs.size === 0 ||
      [...selectedLangs].every((l) => c.languages.includes(l));

    return matchesQuery && matchesLangs;
  });

  /* ------------------------------------------------------
      UI
  ------------------------------------------------------ */
  return (
    <main className="min-h-screen px-4 md:px-8 py-10">
      {/* Header */}
      <section className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Concepts
        </h1>
        <p className="opacity-70 mt-2">
          Bite-size theory with guided topics from your real database.
        </p>

        {/* Filters */}
        <div className="mt-6 space-y-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, topics…"
            className="w-full rounded-lg border px-3 py-2"
          />

          <div className="flex flex-wrap gap-2">
            <LangPill
              active={selectedLangs.size === 0}
              onClick={() => setSelectedLangs(new Set())}
            >
              Any Language
            </LangPill>

            {["JavaScript", "TypeScript", "SQL", "Python"].map((l) => (
              <LangPill
                key={l}
                active={selectedLangs.has(l)}
                onClick={() => toggleLang(l)}
              >
                {l}
              </LangPill>
            ))}
          </div>
        </div>
      </section>

      {/* Concepts Grid */}
      <section className="max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="opacity-70 py-20 text-center">
            No concepts match those filters...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const pct = conceptProgress(c.topics);
              const count = c.topics.length;
              const mins = totalMins(c.topics);

              return (
                <article
                  key={c.id}
                  className={cls(
                    "rounded-2xl border bg-gradient-to-br p-4",
                    c.gradient
                  )}
                >
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <p className="mt-1 text-sm opacity-80">{c.description}</p>

                  <div className="mt-4">
                    <div className="text-xs opacity-70">Topics</div>

                    <div className="flex flex-col gap-3 mt-2">
                        {c.topics.slice(0, 4).map((t) => (
                          <TopicRow key={t.id} topic={t} conceptSlug={c.key} />
                        ))}

                        {c.topics.length > 4 && (
                          <div className="text-xs opacity-70 mt-1">
                            +{c.topics.length - 4} more topics
                          </div>
                        )}
                    </div>
                   
                  </div>

                  <div className="mt-4">
                    <a
                      href={`/platform/concepts/${c.key}`}
                      className="px-3 py-2 rounded-lg bg-black text-white text-sm"
                    >
                      View concept
                    </a>
                  </div>

                  <div className="text-[10px] opacity-60 mt-3">
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
