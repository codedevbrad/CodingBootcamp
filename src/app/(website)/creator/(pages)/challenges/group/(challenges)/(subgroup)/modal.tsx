"use client";

import { useState } from "react";
import { createSubGroup, updateSubGroup } from "../../../../../../../features/challenges/creator/domains/db";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function SubGroupModal({
  groupId,
  subgroup,
  onClose,
  onCreated,
  onUpdated,
}: {
  groupId: string;
  subgroup?: any;
  onClose: () => void;
  onCreated?: (sg: any) => void;
  onUpdated?: (sg: any) => void;
}) {
  const isEdit = !!subgroup;

  const [form, setForm] = useState({
    title: subgroup?.title || "",
    description: subgroup?.description || "",
    key: subgroup?.key || "",
  });

  function updateTitle(title: string) {
    setForm({
      ...form,
      title,
      key: slugify(title),
    });
  }

  async function handleSubmit() {
    if (isEdit) {
      const updated = await updateSubGroup(subgroup.id, form);
      onUpdated?.(updated);
    } else {
      const created = await createSubGroup(groupId, form);
      onCreated?.(created);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit SubGroup" : "New SubGroup"}
        </h2>

        {/* Title */}
        <input
          value={form.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="SubGroup title"
          className="w-full mb-3 px-3 py-2 rounded border"
        />

        {/* Key (auto generated) */}
        <input
          value={form.key}
          disabled
          className="w-full mb-3 px-3 py-2 rounded border bg-neutral-200 dark:bg-neutral-800 opacity-60 cursor-not-allowed"
        />

        {/* Description */}
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)"
          className="w-full mb-3 px-3 py-2 rounded border"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 border rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded"
            onClick={handleSubmit}
          >
            {isEdit ? "Save Changes" : "Create SubGroup"}
          </button>
        </div>
      </div>
    </div>
  );
}
