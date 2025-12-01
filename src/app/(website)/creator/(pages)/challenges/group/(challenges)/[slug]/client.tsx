"use client";

import { useState } from "react";
import Link from "next/link";

import ChallengeModal from "./modal";
import { deleteChallenge } from "../../../db";

// Prisma Types
import type {
  Challenge,
  Category,
  Difficulty,
  Language,
  ChallengeGroup,
  ChallengeLanguage,
  ChallengeSubGroup,
} from "@prisma/client";

// Full Challenge Type With All Relations
export type ChallengeWithRelations = Challenge & {
  category: Category | null;
  difficulty: Difficulty | null;
  subGroup: ChallengeSubGroup | null;
  languages: (ChallengeLanguage & { language: Language })[];
};

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ChallengesInGroupClient({
  group,
  challenges,
  categories,
  difficulties,
  languages,
  subgroups,
}: {
  group: ChallengeGroup;
  challenges: ChallengeWithRelations[];
  categories: Category[];
  difficulties: Difficulty[];
  languages: Language[];
  subgroups: ChallengeSubGroup[];
}) {
  // Local state for rendered challenges
  const [items, setItems] = useState<ChallengeWithRelations[]>(challenges);

  const [editing, setEditing] = useState<ChallengeWithRelations | null>(null);
  const [creating, setCreating] = useState(false);

  /** DELETE a challenge */
  async function remove(id: string) {
    await deleteChallenge(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <main className="px-8 py-10 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{group.title}</h1>
        <p className="opacity-70 mt-1">{group.description}</p>
      </div>

      {/* CREATE BUTTON */}
      <Button variant="default" onClick={() => setCreating(true)} className="mb-6">
        + New Challenge
      </Button>

      {/* LIST OF CHALLENGES */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Card
            key={c.id}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900 hover:shadow-lg transition-all"
          >
            <CardHeader className="space-y-1">
              <h2 className="font-semibold text-lg">{c.title}</h2>
              <p className="text-sm opacity-80 line-clamp-2">{c.description}</p>

              {/* Subgroup Badge */}
              {c.subGroup && (
                <div className="text-xs mt-1 px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-full inline-block">
                  Subgroup: {c.subGroup.title}
                </div>
              )}
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2 mt-1 text-xs">
                {c.category && (
                  <span className="px-2 py-1 rounded bg-black/10 dark:bg-white/10">
                    {c.category.title}
                  </span>
                )}

                {c.difficulty && (
                  <span className="px-2 py-1 rounded bg-black/10 dark:bg-white/10">
                    {c.difficulty.title}
                  </span>
                )}
              </div>

              {/* LANGUAGES */}
              <div className="flex flex-wrap gap-2 mt-3">
                {c.languages.map((cl) => (
                  <span
                    key={cl.languageId}
                    className="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10"
                  >
                    {cl.language.title}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-4">
              {/* EDIT */}
              <Button variant="outline" size="sm" onClick={() => setEditing(c)}>
                Edit
              </Button>

              {/* OPEN FULL PAGE */}
              <Button
                size="sm"
                asChild
                className="bg-black text-white dark:bg-white dark:text-black"
              >
                <Link href={`/creator/challenges/group/challenge/${c.id}`}>
                  Open
                </Link>
              </Button>

              {/* DELETE */}
              <Button variant="destructive" size="sm" onClick={() => remove(c.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      {(creating || editing) && (
        <ChallengeModal
          challenge={editing}
          groupId={group.id}
          categories={categories}
          difficulties={difficulties}
          languages={languages}
          subgroups={subgroups}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onCreated={(c) =>
            setItems((prev) => {
              const fixed = {
                ...c,
                subGroup: subgroups.find((sg) => sg.id === c.subGroupId) ?? null,
              } as ChallengeWithRelations;

              return [fixed, ...prev];
            })
          }
          onUpdated={(updated) =>
            setItems((prev) =>
              prev.map((x) => {
                if (x.id !== updated.id) return x;

                return {
                  ...updated,
                  subGroup: subgroups.find((sg) => sg.id === updated.subGroupId) ?? null,
                } as ChallengeWithRelations;
              })
            )
          }
        />
      )}
    </main>
  );
}
