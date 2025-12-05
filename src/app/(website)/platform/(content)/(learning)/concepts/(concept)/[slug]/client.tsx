"use client";

import * as React from "react"; 

import { Topic, TopicStatus } from "../../utils/_types";

function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function StatusDot({ status }: { status: TopicStatus }) {
  const tone =
    status === "Completed"
      ? "bg-black dark:bg-white"
      : status === "Locked"
      ? "bg-black/20 dark:bg-white/30"
      : "bg-black/60 dark:bg-white/70";
  return <span className={cls("inline-block h-2.5 w-2.5 rounded-full", tone)} />;
}


function TopicRow({
  conceptSlug,
  topic,
}: {
  conceptSlug: string;
  topic: Topic;
}) {
  const isLocked = topic.status === "Locked";
  const isDone = topic.status === "Completed";

  return (
    <div
      className={cls(
        "rounded-xl px-3 py-2",
        "bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10",
        isLocked && "opacity-60"
      )}
      aria-label={`${topic.title} — ${topic.estMins} minutes — ${topic.status}`}
    >
      <div className="flex items-center gap-3">
        <StatusDot status={topic.status} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cls("truncate text-sm font-medium", isDone && "line-through")}>
              {topic.title}
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
              {topic.estMins}m
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <div
              className={cls(
                "h-full rounded-full transition-all",
                isDone ? "bg-black dark:bg-white w-full" : "bg-black/40 dark:bg-white/70 w-1/5"
              )}
            />
          </div>
        </div>

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

export default function ConceptClient({
  conceptKey,
  topics,
}: {
  conceptKey: string;
  topics: Topic[];
}) {
  // If you later need per-topic local state (expand, mark done, etc.), add it here
  return (
    <div className="grid gap-2">
      {topics.map((t) => (
        <TopicRow key={ t.id } conceptSlug={conceptKey} topic={t} />
      ))}
    </div>
  );
}
