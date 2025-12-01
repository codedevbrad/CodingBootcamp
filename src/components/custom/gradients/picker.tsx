"use client";

import { GRADIENTS } from "./choices";

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {GRADIENTS.map((g) => {
        const active = value === g.value;

        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onChange(g.value)}
            className={`
              rounded-xl p-3 border transition bg-gradient-to-br ${g.value}
              ${active ? "border-black dark:border-white scale-[1.03]" : "border-black/10 dark:border-white/10 hover:scale-[1.02]"}
            `}
          >
            <span className="text-xs font-medium drop-shadow-sm">
              {g.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
