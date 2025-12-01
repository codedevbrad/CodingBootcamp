"use client";

import { useParams } from "next/navigation";
import { useTopics } from "../../../../hooks/useTopics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TopicModal from "./modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TopicsPage() {
  const { slug } = useParams();
  const conceptId = slug as string;

  const { topics, isLoading, mutate } = useTopics(conceptId);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Topics for Concept </h1>
        <TopicModal mode="create" conceptId={conceptId} onSaved={() => mutate()} />
      </div>

      {isLoading && <p className="text-zinc-500">Loading topics...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics?.map((t: any) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                {t.title}
                <TopicModal
                  mode="edit"
                  conceptId={conceptId}
                  topic={t}
                  onSaved={() => mutate()}
                />
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-zinc-600">
                <strong>Slug:</strong> {t.slug}
              </p>
              <p className="mt-2 text-sm">{t.description}</p>

              <div className="flex flex-row justify-end py-4">
                    <Button variant={'default'}>
                        <Link href={`/creator/topic/${ t.id }`}>
                           Write
                        </Link>
                    </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}