"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ChallengeGroupItem({
  group,
  onEdit,
  onDelete,
}: {
  group: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const challenges = group.challenges ?? [];

  // Extract aggregated properties
  const languages = Array.from(
    new Set(
      challenges.flatMap((c: any) =>
        c.languages?.map((l: any) => l.language?.title)
      )
    )
  ).filter(Boolean);

  const categories = Array.from(
    new Set(challenges.map((c: any) => c.category?.title))
  ).filter(Boolean);

  const tags = Array.from(new Set(challenges.flatMap((c: any) => c.tags)))
    .filter(Boolean)
    .slice(0, 6); // keep tidy

  return (
    <Card
      className={`
        relative overflow-hidden border border-black/10 dark:border-white/10 
        rounded-2xl transition-all duration-300 hover:shadow-lg
        bg-gradient-to-br ${
          group.color ??
          "from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800"
        }
      `}
    >
      <CardHeader className="space-y-1 pb-3">
        <h2 className="text-lg font-semibold">{group.title}</h2>
        {group.description && (
          <p className="text-sm opacity-80">{group.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Challenge Count */}
        <div className="text-sm font-medium">
          {challenges.length} Challenge{challenges.length !== 1 ? "s" : ""}
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {languages.map((l) => (
              <Badge
                key={l}
                variant="secondary"
                className="rounded-full px-2 py-1 text-xs"
              >
                {l}
              </Badge>
            ))}
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <Badge
                key={c}
                variant="outline"
                className="rounded-full px-2 py-1 text-xs"
              >
                {c}
              </Badge>
            ))}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="rounded-md px-2 py-1 text-xs opacity-80"
              >
                #{t}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-xs opacity-60 mt-1">Key: {group.key}</div>
      </CardContent>

      <CardFooter className="flex justify-between pt-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-black text-white dark:bg-white dark:text-black"
          >
            <Link href={`/creator/challenges/group/${group.id}`}>View</Link>
          </Button>
        </div>

        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
