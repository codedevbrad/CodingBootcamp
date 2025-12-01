"use client";

import * as React from "react";
import Link from "next/link";

import type { UIChallengeGroup } from "./db";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

/* ---------------- Helpers ---------------- */
function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-black dark:bg-white transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function ChallengeGroupsPageClient({
  initialGroups,
}: {
  initialGroups: UIChallengeGroup[];
}) {
  const [query, setQuery] = React.useState("");

  const filteredGroups = React.useMemo(() => {
    return initialGroups.map((group) => {
      const filteredSubgroups = group.subgroups
        .map((sg) => ({
          ...sg,
          challenges: sg.challenges.filter((c) =>
            c.title.toLowerCase().includes(query.toLowerCase())
          ),
        }))
        .filter((sg) => sg.challenges.length > 0);

      return { ...group, subgroups: filteredSubgroups };
    });
  }, [initialGroups, query]);

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6">Challenge Groups</h1>

      {/* Search */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search challenges…"
        className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 mb-10"
      />

      {/* GROUPS */}
      <div className="grid gap-10 sm:grid-cols-2">
        {filteredGroups.map((group) => (
          <section
            key={group.id}
            className={cls(
              "rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br p-6 flex flex-col",
              group.color ||
                "from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
            )}
          >
            <h2 className="text-2xl font-bold">{group.title}</h2>
            {group.description && (
              <p className="opacity-70 mt-1 text-sm">{group.description}</p>
            )}

            {/* --- SUBGROUPS --- */}
            {group.subgroups.length > 0 && (
              <div className="mt-6 space-y-8">
                {group.subgroups.map((sg) => (
                  <div
                    key={sg.id}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  >
                    {/* Subgroup header */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{sg.title}</h3>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="default" size="sm">
                            View {sg.challenges.length} tasks
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[430px] p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900">
                          <div className="space-y-4">
                            {sg.challenges.map((c) => (
                              <div
                                key={c.id}
                                className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10"
                              >
                                {/* Title row */}
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center gap-2">
                                    {/* LEFT DOT */}
                                    <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />

                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-semibold text-sm">
                                        {c.title}
                                      </h4>

                                      {/* category + difficulty */}
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                                        {c.category}
                                      </span>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                                        {c.difficulty}
                                      </span>
                                    </div>
                                  </div>

                                  {/* OPEN BUTTON */}
                                  <Button size="sm" asChild>
                                    <Link href={`/platform/challenges/${c.slug}`}>
                                      Open
                                    </Link>
                                  </Button>
                                </div>

                                {/* TIME */}
                                <div className="flex items-center gap-2 text-xs mb-2">
                                  <span className="px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full">
                                    {c.estMins}m
                                  </span>
                                </div>

                                {/* PROGRESS BAR */}
                                <ProgressBar value={c.progress} />

                                {/* LANGUAGES */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {c.languages.map((lang) => (
                                    <span
                                      key={lang}
                                      className="text-[10px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10"
                                    >
                                      {lang}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
