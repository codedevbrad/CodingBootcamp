"use client";

import { useState } from "react"; 
import ChallengeGroupModal from "../group/modal";
import { deleteChallengeGroup } from "../db";

import ChallengeGroupItem from "./challenge.group";

export default function ChallengeGroupListClient({ groups }) {
  const [items, setItems] = useState(groups);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  async function remove(id) {
    await deleteChallengeGroup(id);
    setItems((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Challenge Groups</h1>

        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg"
        >
          + New Group
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((g) => (
          <ChallengeGroupItem
            key={g.id}
            group={g}
            onEdit={() => setEditing(g)}
            onDelete={() => remove(g.id)}
          />
        ))}
      </div>

      {/* CREATE Modal */}
      {creating && (
        <ChallengeGroupModal
          onClose={() => setCreating(false)}
          onCreated={(g) => setItems((prev) => [g, ...prev])}
        />
      )}

      {/* EDIT Modal */}
      {editing && (
        <ChallengeGroupModal
          group={editing}
          onClose={() => setEditing(null)}
          onUpdated={(updated) =>
            setItems((prev) =>
              prev.map((x) => (x.id === updated.id ? updated : x))
            )
          }
        />
      )}
    </div>
  );
}
