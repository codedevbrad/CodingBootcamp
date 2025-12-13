"use client";

import { useState, useEffect } from "react";
import ColorPicker from "@/components/custom/gradients/picker";
import { createChallengeGroup, updateChallengeGroup } from "../../../../../features/challenges/creator/domains/db";

// 👇 100% reliable client-only slugify
const slugifyClient = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ChallengeGroupModal({
  group,
  onClose,
  onCreated,
  onUpdated,
}) {
  const isEdit = !!group;

  const [title, setTitle] = useState(group?.title ?? "");
  const [key, setKey] = useState(group?.key ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [color, setColor] = useState(group?.color ?? "");

  const handleTitleUpdate = ( value ) => {
    setTitle( prev => value );
    setKey( prev => slugifyClient( value ));
  }


  async function save() {
    const payload = { key, title, description, color };

    if (isEdit) {
      const updated = await updateChallengeGroup(group.id, payload);
      onUpdated(updated);
    } else {
      const created = await createChallengeGroup(payload);
      onCreated(created);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-lg shadow-xl border border-black/10 dark:border-white/10">

        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Challenge Group" : "Create Challenge Group"}
        </h2>

        {/* Title */}
        <div className="mb-3">
          <label className="text-sm opacity-70">Title</label>
          <input
            value={title}
            onChange={(e) => handleTitleUpdate(e.target.value)}
            placeholder="System Design"
            className="w-full mt-1 px-3 py-2 border rounded bg-white/70 dark:bg-white/5"
          />
        </div>

        {/* Auto-generated key */}
        <div className="mb-3">
          <label className="text-sm opacity-70">Key (auto-generated)</label>
          <input
            value={key}
            readOnly
            className="w-full mt-1 px-3 py-2 border rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-sm opacity-70">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe this group…"
            className="w-full mt-1 px-3 py-2 border rounded bg-white/70 dark:bg-white/5"
          />
        </div>

        {/* Color */}
        <div className="mb-4">
          <label className="text-sm opacity-70 mb-2 block">Colour</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={save}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg"
          >
            {isEdit ? "Save Changes" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
