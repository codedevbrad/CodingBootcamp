"use client";

import { useEffect, useState } from "react";
import { createChallenge, updateChallenge } from "../../../../../../../features/challenges/creator/domains/db";
import type {
  Challenge,
  Category,
  Difficulty,
  Language,
  ChallengeSubGroup,
  ChallengeWorkType,
} from "@prisma/client";
import { slugify } from "@/lib/utils";

type ChallengeWithLangs = Challenge & {
  languages: { languageId: string }[];
};

export default function ChallengeModal({
  challenge,
  groupId,
  categories,
  difficulties,
  languages,
  subgroups,
  onClose,
  onCreated,
  onUpdated,
}: {
  challenge?: ChallengeWithLangs | null;
  groupId: string;
  categories: Category[];
  difficulties: Difficulty[];
  languages: Language[];
  subgroups: ChallengeSubGroup[];
  onClose: () => void;
  onCreated: (c: Challenge) => void;
  onUpdated: (c: Challenge) => void;
}) {
  const isEdit = Boolean(challenge);

  const [form, setForm] = useState({
    title: challenge?.title ?? "",
    slug: challenge?.slug ?? "",
    description: challenge?.description ?? "",
    categoryId: challenge?.categoryId ?? "",
    difficultyId: challenge?.difficultyId ?? "",
    estMins: challenge?.estMins ?? 30,
    tags: challenge?.tags?.join(", ") ?? "",
    languageIds: challenge?.languages?.map((l) => l.languageId) ?? [],
    subGroupId: challenge?.subGroupId ?? "",   // 👈 FIXED
    workType: (challenge?.workType ?? "CODE") as ChallengeWorkType,
  });

  /* ------------------------- Auto Slug for Create ------------------------- */
  useEffect(() => {
    if (!isEdit) {
      const generated = slugify(form.title);
      setForm((f) => ({ ...f, slug: generated }));
    }
  }, [form.title, isEdit]);

  /* ------------------------- Language Toggle ------------------------- */
  function toggleLang(id: string) {
    setForm((f) => ({
      ...f,
      languageIds: f.languageIds.includes(id)
        ? f.languageIds.filter((x) => x !== id)
        : [...f.languageIds, id],
    }));
  }

  /* ------------------------- Submit ------------------------- */
  async function handleSubmit() {
    const payload = {
      ...form,
      subGroupId: form.subGroupId || null, // 👈 FIXED — Prisma expects null
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isEdit) {
      const updated = await updateChallenge(challenge!.id, payload);
      onUpdated(updated);
    } else {
      const created = await createChallenge(groupId, payload);
      onCreated(created);
    }

    onClose();
  }

  /* ------------------------- UI ------------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Challenge" : "New Challenge"}
        </h2>

        {/* Title */}
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full mb-3 px-3 py-2 rounded border"
        />

        {/* Slug */}
        <input
          value={form.slug}
          disabled
          className="w-full mb-3 px-3 py-2 rounded border bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
        />

        {/* Description */}
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Description"
          className="w-full mb-3 px-3 py-2 rounded border"
        />

        {/* Category */}
        <select
          value={form.categoryId}
          onChange={(e) =>
            setForm({ ...form, categoryId: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 rounded border"
        >
          <option value="">Select Category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <select
          value={form.difficultyId}
          onChange={(e) =>
            setForm({ ...form, difficultyId: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 rounded border"
        >
          <option value="">Select Difficulty…</option>
          {difficulties.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>

        {/* SubGroup */}
        <select
          value={form.subGroupId}
          onChange={(e) =>
            setForm({ ...form, subGroupId: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 rounded border"
        >
          <option value="">No subgroup</option>
          {subgroups.map((sg) => (
            <option key={sg.id} value={sg.id}>
              {sg.title}
            </option>
          ))}
        </select>

        {/* Work Type */}
        <select
          value={form.workType}
          onChange={(e) =>
            setForm({ ...form, workType: e.target.value as ChallengeWorkType })
          }
          className="w-full mb-3 px-3 py-2 rounded border"
        >
          <option value="CODE">Code</option>
          <option value="EXERCISE">Exercise</option>
          <option value="DIAGRAM">Diagram</option>
        </select>

        {/* Languages */}
        <div className="flex flex-wrap gap-2 mb-3">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => toggleLang(l.id)}
              className={`px-3 py-1 rounded border text-sm ${
                form.languageIds.includes(l.id)
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white dark:bg-neutral-800"
              }`}
            >
              {l.title}
            </button>
          ))}
        </div>

        {/* Estimated time */}
        <input
          type="number"
          value={form.estMins}
          onChange={(e) =>
            setForm({ ...form, estMins: Number(e.target.value) })
          }
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        {/* Tags */}
        <input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="Tags (comma separated)"
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded"
          >
            {isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
