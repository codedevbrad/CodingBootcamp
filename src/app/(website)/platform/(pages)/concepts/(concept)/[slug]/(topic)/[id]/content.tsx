"use client";

import { useEffect, useState } from "react";
import SimpleEditor from "@/components/systems/editor";
import { getTopicBySlug } from "../../../../db";
import { Badge } from "@/components/ui/badge";

import TopicBottomBar from "./topicBottomBar";
import LoadingClient from "./topicLoading"; // <<< YOUR LOADING WRAPPER

export default function TopicContent({ topicSlug }: { topicSlug: string }) {
  const [topic, setTopic] = useState<any>(null);
  const [editorJSON, setEditorJSON] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getTopicBySlug(topicSlug);
      if (!data) return;

      setTopic(data);

      const content = data.content
        ? typeof data.content === "string"
          ? JSON.parse(data.content)
          : data.content
        : null;

      setEditorJSON(content);
    }
    load();
  }, [topicSlug]);

  // ❗ We remove the "loading" return — now LoadingClient handles it.

  return (
    <LoadingClient>
      {/* Everything inside here renders ONLY after loading animation completes */}
      {!topic ? (
        <p className="p-8 text-center opacity-60">Topic not found.</p>
      ) : (
        <div className="w-full pb-20">

          {/* BOTTOM BAR */}
          <TopicBottomBar
            title={topic.title}
            difficulty={topic.difficulty}
            estMins={topic.estMins}
            onTestClick={() => console.log("start test")}
          />

          {/* HEADER */}
          <header className="max-w-4xl mx-auto pt-12 pb-8 px-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-center">
            <div className="flex flex-col gap-3">

              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                {topic.title}
              </h1>

              {topic.description && (
                <p className="text-zinc-500 dark:text-zinc-300 max-w-2xl leading-7">
                  {topic.description}
                </p>
              )}

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mt-4">
                {topic.languages?.map((l: any) => (
                  <Badge
                    key={l.languageId}
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {l.language.title}
                  </Badge>
                ))}

                {topic.categories?.map((c: any) => (
                  <Badge
                    key={c.categoryId}
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  >
                    {c.category.title}
                  </Badge>
                ))}

                {topic.estMins && (
                  <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {topic.estMins} min read
                  </Badge>
                )}

                {topic.recommended && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Recommended
                  </Badge>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT BODY */}
          <section className="max-w-4xl mx-auto px-6 pt-10">
            {editorJSON ? (
              <SimpleEditor initialContent={editorJSON} readOnly />
            ) : (
              <p className="opacity-60 italic">No content written yet.</p>
            )}
          </section>
        </div>
      )}
    </LoadingClient>
  );
}
