import { notFound } from "next/navigation";
import { getConceptBySlugSA } from "../../utils/util.db";
import ConceptClient from "./client";

/* --------------------- Small Utils --------------------- */
function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function conceptProgress(topics: any[]) {
  const done = topics.filter((t) => t.status === "Completed").length;
  return Math.round((done / Math.max(1, topics.length)) * 100);
}

function totalMins(topics: any[]) {
  return topics.reduce((a, b) => a + (b.estMins ?? 0), 0);
}

/* -------------------------------------------------------- */

export default async function ConceptPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug; // slug === concept.key

  // ⭐ Fetch concept using KEY (slug)
  const concept = await getConceptBySlugSA(slug);
  if (!concept) return notFound();

  /* ----------------- Derived UI values ----------------- */
  const topics = concept.topics ?? [];

  const pct = conceptProgress(topics);
  const mins = totalMins(topics);
  const count = topics.length;

  // combine all tags from topics (or store tags on concept)
  const tags = [
    ...new Set(topics.flatMap((t) => t.tags ?? [])),
  ];

  // languages collected from topic->TopicLanguage->Language.title
  const languages = [
    ...new Set(
      topics
        .flatMap((t) =>
          (t.languages ?? []).map((l) => l.language?.title).filter(Boolean)
        )
        .filter(Boolean)
    ),
  ];

  // default gradient fallback
  const gradient =
    concept.gradient ?? "from-slate-200/40 to-slate-300/40";

  /* ------------------------------------------------------ */

  return (
    <main className="min-h-screen px-4 md:px-8 pb-16">
      {/* Sticky header */}
      <header
        className={cls(
          "sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-black/30 border-b",
          "border-black/10 dark:border-white/10"
        )}
      >
        <div className="max-w-5xl mx-auto py-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="min-w-0">
              <a
                href="/platform/concepts"
                className="inline-flex items-center mt-6 text-sm underline decoration-dotted underline-offset-4 opacity-80 hover:opacity-100"
              >
                ← Back to Concepts
              </a>

              <div className="text-xs opacity-70 mt-1">Concept</div>

              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight truncate">
                {concept.title}
              </h1>

              <div className="mt-1 text-xs flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  {concept.category ?? "General"}
                </span>

                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  {concept.difficulty ?? "Beginner"}
                </span>

                <span className="px-2 py-0.5 rounded-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  {count} topics • ~{mins}m
                </span>
              </div>
            </div>

            {/* Slim progress */}
            <div className="w-full md:w-80">
              <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-black/80 dark:bg-white"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs opacity-70 mt-1 text-right">
                {pct}% complete
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto pt-6">
        <div
          className={cls(
            "rounded-2xl p-5 border bg-gradient-to-br",
            gradient,
            "border-black/10 dark:border-white/10"
          )}
        >
          <p className="opacity-90 text-sm md:text-base">
            {concept.description}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Languages */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {languages.map((lang) => (
              <span
                key={lang}
                className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Topics List (client-interactive) */}
      <section className="max-w-5xl mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-3">Topics</h2> 

        {/* Passing REAL DB conceptId */}
        <ConceptClient conceptKey={concept.key} topics={topics} />
      </section>
    </main>
  );
}

/* -------------------- Metadata -------------------- */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const c = await getConceptBySlugSA(params.slug);
  if (!c)
    return { title: "Concept not found | CodeBootcamp" };

  return {
    title: `${c.title} | Concepts`,
    description: c.description,
  };
}
