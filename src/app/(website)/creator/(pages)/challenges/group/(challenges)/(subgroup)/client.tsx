"use client";

import { useState } from "react";
import SubGroupModal from "./modal";
import { deleteSubGroup } from "../../../db";

export default function SubGroupListClient({
  groupId,
  initialSubGroups,
}: {
  groupId: string;
  initialSubGroups: any[];
}) {
  const [subgroups, setSubgroups] = useState(initialSubGroups);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  async function remove(id: string) {
    await deleteSubGroup(id);
    setSubgroups((prev) => prev.filter((sg) => sg.id !== id));
  }

  return (
    <section className="mt-10">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">SubGroups</h2>

        <button
          onClick={() => setCreating(true)}
          className="px-3 py-2 bg-black text-white dark:bg-white dark:text-black rounded"
        >
          + New SubGroup
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {subgroups.map((sg) => (
          <div
            key={sg.id}
            className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5"
          >
            <h3 className="font-bold text-lg">{sg.title}</h3>
            <p className="text-sm opacity-75 mt-1">{sg.description}</p>

            <div className="text-xs opacity-60 mt-2">{sg.key}</div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setEditing(sg)}
                className="px-3 py-1 border text-sm rounded"
              >
                Edit
              </button>

              <button
                onClick={() => remove(sg.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <SubGroupModal
          groupId={groupId}
          subgroup={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onCreated={(sg) => setSubgroups((prev) => [sg, ...prev])}
          onUpdated={(sg) =>
            setSubgroups((prev) =>
              prev.map((x) => (x.id === sg.id ? sg : x))
            )
          }
        />
      )}
    </section>
  );
}
