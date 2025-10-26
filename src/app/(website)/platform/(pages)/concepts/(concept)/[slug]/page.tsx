import { notFound } from "next/navigation";
import { Concept } from "../../uses/_types";
import ConceptClient from "../client";
import { getConceptBySlugSA } from "../getConcept";

function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function conceptProgress(topics: Concept["topics"]) {
  const done = topics.filter((t) => t.status === "Completed").length;
  return Math.round((done / Math.max(1, topics.length)) * 100);
}
function totalMins(topics: Concept["topics"]) {
  return topics.reduce((a, b) => a + b.estMins, 0);
}

export default async function ConceptPage({ params }: { params: { slug: string } }) {

  const slug = await params.slug;
  // 🔽 Fetch the dummy concept via SERVER ACTION
  const concept = await getConceptBySlugSA(slug);
  if (!concept) return notFound();

  const pct = conceptProgress(concept.topics);
  const mins = totalMins(concept.topics);
  const count = concept.topics.length;

  return (
    <main className="min-h-screen px-4 md:px-8 pb-16">
      {/* Sticky header (server-rendered) */}
      <header
        className={cls(
          "sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-black/30 border-b",
          "border-black/10 dark:border-white/10"
        )}
      >
        <div className="max-w-5xl mx-auto py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs opacity-70">Concept</div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight truncate">
                {concept.title}
              </h1>
              <div className="mt-1 text-xs flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  {concept.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  {concept.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  {count} topic{count > 1 ? "s" : ""} • ~{mins}m
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
              <div className="text-xs opacity-70 mt-1 text-right">{pct}% complete</div>
            </div>
          </div>
        </div>
      </header>

      {/* Gradient hero strip (server-rendered) */}
      <section className="max-w-5xl mx-auto pt-6">
        <div
          className={cls(
            "rounded-2xl p-5 border bg-gradient-to-br",
            concept.gradient,
            "border-black/10 dark:border-white/10"
          )}
        >
          <p className="opacity-90 text-sm md:text-base">{concept.description}</p>

          {/* tags + languages */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {concept.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10">
                #{t}
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {concept.languages.map((lang) => (
              <span
                key={lang}
                className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
              >
                {lang}
              </span>
            ))}
          </div>

          <div className="mt-3 text-[10px] opacity-60">
            Updated {new Date(concept.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </section>

      {/* Topics list (client-rendered for interactivity) */}
      <section className="max-w-5xl mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-3">Topics</h2>
        <ConceptClient conceptSlug={concept.slug} topics={concept.topics} />

        {/* Back link */}
        <div className="mt-8">
          <a
            href="/platform/concepts"
            className="inline-flex items-center text-sm underline decoration-dotted underline-offset-4 opacity-80 hover:opacity-100"
          >
            ← Back to Concepts
          </a>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = await params.slug;
  const c = await getConceptBySlugSA(slug);
  if (!c) return { title: "Concept not found | CodeBootcamp" };
  return {
    title: `${c.title} | Concepts`,
    description: c.description,
  };
}
