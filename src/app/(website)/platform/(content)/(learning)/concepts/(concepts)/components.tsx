"use client"
import React from "react"

/* ---------------------------------- Types ---------------------------------- */

import { TopicStatus , UITopic } from "../utils/_types"

/* ------------------------------- UI Helpers -------------------------------- */

export function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export function conceptProgress(topics: UITopic[]) {
  const done = topics.filter((t) => t.status === "Completed").length;
  return Math.round((done / Math.max(1, topics.length)) * 100);
}

export function totalMins(topics: UITopic[]) {
  return topics.reduce((a, b) => a + (b.estMins || 0), 0);
}


interface LangPillProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function LangPill({ active, children, onClick }: LangPillProps) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "px-3 py-1.5 rounded-full border text-sm transition select-none",
        active
          ? "bg-black text-white dark:bg-white dark:text-black border-black/0"
          : "bg-white/70 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}


/* ------------------------------- Status Dot -------------------------------- */

export function StatusDot({ status }: { status: TopicStatus }) {
  const tone =
    status === "Completed"
      ? "bg-black dark:bg-white"
      : status === "Locked"
      ? "bg-black/20 dark:bg-white/30"
      : "bg-black/60 dark:bg-white/70";
  return <span className={cls("inline-block h-2.5 w-2.5 rounded-full", tone)} />;
}

/* -------------------------------- Topic Row -------------------------------- */

export function TopicRow({
  topic,
  conceptSlug,
}: {
  topic: UITopic;
  conceptSlug: string;
}) {
  const isLocked = topic.status === "Locked";
  const isDone = topic.status === "Completed";

  return (
    <div
      className={cls(
        "group rounded-xl px-3 py-2",
        "bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10",
        isLocked && "opacity-60"
      )}
      aria-label={`${topic.title} — ${topic.estMins} minutes — ${topic.status}`}
    >
      <div className="flex items-center gap-3">
        <StatusDot status={topic.status} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cls(
                "truncate text-sm font-medium",
                isDone && "line-through"
              )}
            >
              {topic.title}
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
              {topic.estMins}m
            </span>
          </div>

          {/* progress preview bar */}
          <div className="mt-1 h-1.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <div
              className={cls(
                "h-full rounded-full transition-all",
                isDone
                  ? "bg-black dark:bg-white w-full"
                  : "bg-black/40 dark:bg-white/70 w-1/5 group-hover:w-1/3"
              )}
            />
          </div>
        </div>

        {/* Open button */}
        <a
          href={`/platform/concepts/${conceptSlug}/${topic.slug}`}
          className={cls(
            "text-xs px-2 py-1 rounded-lg border border-black/10 dark:border-white/10",
            "bg-white/70 dark:bg-white/5 hover:bg-white"
          )}
          onClick={(e) => {
            if (isLocked) {
              e.preventDefault();
              alert("This topic is locked.");
            }
          }}
        >
          Open
        </a>
      </div>
    </div>
  );
}
