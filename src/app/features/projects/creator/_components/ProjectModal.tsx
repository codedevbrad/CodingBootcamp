"use client";

import { useEffect, useState } from "react";
import { createProject, updateProject } from "../_domain/db";
import type { Difficulty } from "@prisma/client";
import { slugify } from "@/lib/utils";
import CategoryMultiSelect from "@/app/features/categories/_shared/_components/categorySelect";
import LanguageMultiSelect from "@/app/features/languages/_shared/_components/languageSelect";
import ColorPicker from "@/components/custom/gradients/picker";

type ProjectWithRelations = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  estHours: number;
  color?: string | null;
  tags: string[];
  difficultyId?: string | null;
  categories: { category: { id: string } }[];
  languages: { language: { id: string } }[];
};

export default function ProjectModal({
  project,
  difficulties,
  onClose,
  onCreated,
  onUpdated,
}: {
  project?: ProjectWithRelations | null;
  difficulties: Difficulty[];
  onClose: () => void;
  onCreated: (p: any) => void;
  onUpdated: (p: any) => void;
}) {
  const isEdit = Boolean(project);

  const [form, setForm] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    estHours: project?.estHours ?? 1,
    color: project?.color ?? "",
    tags: project?.tags?.join(", ") ?? "",
    difficultyId: project?.difficultyId ?? "",
    categoryIds: project?.categories?.map((c) => c.category.id) ?? [],
    languageIds: project?.languages?.map((l) => l.language.id) ?? [],
  });

  const [loading, setLoading] = useState(false);

  /* ------------------------- Auto Slug for Create ------------------------- */
  useEffect(() => {
    if (!isEdit) {
      const generated = slugify(form.title);
      setForm((f) => ({ ...f, slug: generated }));
    }
  }, [form.title, isEdit]);

  /* ------------------------- Submit ------------------------- */
  async function handleSubmit() {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description?.trim() || undefined,
        estHours: form.estHours,
        color: form.color?.trim() || undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        categoryIds: form.categoryIds,
        languageIds: form.languageIds,
        difficultyId: form.difficultyId || undefined,
      };

      if (isEdit) {
        const updated = await updateProject(project!.id, payload);
        onUpdated(updated);
      } else {
        const created = await createProject(payload);
        onCreated(created);
      }

      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------- UI ------------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Project" : "New Project"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Project title"
              className="w-full px-3 py-2 rounded border"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-sm font-medium mb-1 block">Slug</label>
            <input
              value={form.slug}
              disabled
              className="w-full px-3 py-2 rounded border bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Project description"
              className="w-full px-3 py-2 rounded border min-h-[100px]"
            />
          </div>

          {/* Estimated Hours */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Estimated Hours
            </label>
            <input
              type="number"
              value={form.estHours}
              onChange={(e) =>
                setForm({ ...form, estHours: Number(e.target.value) })
              }
              min="1"
              className="w-full px-3 py-2 rounded border"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-sm opacity-70 mb-2 block">Colour</label>
            <ColorPicker 
              value={form.color || ""} 
              onChange={(value) => setForm({ ...form, color: value })} 
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium mb-1 block">Difficulty</label>
            <select
              value={form.difficultyId}
              onChange={(e) =>
                setForm({ ...form, difficultyId: e.target.value })
              }
              className="w-full px-3 py-2 rounded border"
            >
              <option value="">Select Difficulty…</option>
              {difficulties.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <CategoryMultiSelect
            selected={form.categoryIds}
            onChange={(ids) => setForm({ ...form, categoryIds: ids })}
          />

          {/* Languages */}
          <LanguageMultiSelect
            selected={form.languageIds}
            onChange={(ids) => setForm({ ...form, languageIds: ids })}
          />

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Tags (comma separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="react, frontend, api"
              className="w-full px-3 py-2 rounded border"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

