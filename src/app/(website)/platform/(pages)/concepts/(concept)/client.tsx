"use client";

import * as React from "react";
import { Topic } from "../uses/_types";
import TopicRow from "../uses/topicRow";

function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export default function ConceptClient({
  conceptSlug,
  topics,
}: {
  conceptSlug: string;
  topics: Topic[];
}) {
  // If you later need per-topic local state (expand, mark done, etc.), add it here
  return (
    <div className="grid gap-2">
      {topics.map((t) => (
        <TopicRow key={t.id} conceptSlug={conceptSlug} topic={t} />
      ))}
    </div>
  );
}
