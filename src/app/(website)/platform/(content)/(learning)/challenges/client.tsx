"use client";

import * as React from "react";
import Link from "next/link";

import type { UIChallengeGroup, UIChallenge } from "../../../../../features/challenges/student/domains/studentChallenges";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- Types ---------------- */
type ChallengeWithGroup = UIChallenge & {
  groupId: string;
  groupTitle: string;
  subgroupId?: string;
  subgroupTitle?: string;
};

/* ---------------- Helpers ---------------- */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-black dark:bg-white transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function ChallengeGroupsPageClient({
  initialGroups,
}: {
  initialGroups: UIChallengeGroup[];
}) {
  const [query, setQuery] = React.useState("");
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>("all");

  // Flatten all challenges with group information
  const allChallenges = React.useMemo<ChallengeWithGroup[]>(() => {
    const challenges: ChallengeWithGroup[] = [];
    
    initialGroups.forEach((group) => {
      // Add challenges directly in the group
      group.challenges.forEach((challenge) => {
        challenges.push({
          ...challenge,
          groupId: group.id,
          groupTitle: group.title,
        });
      });

      // Add challenges from subgroups
      group.subgroups.forEach((subgroup) => {
        subgroup.challenges.forEach((challenge) => {
          challenges.push({
            ...challenge,
            groupId: group.id,
            groupTitle: group.title,
            subgroupId: subgroup.id,
            subgroupTitle: subgroup.title,
          });
        });
      });
    });

    return challenges;
  }, [initialGroups]);

  // Filter challenges based on search and group
  const filteredChallenges = React.useMemo(() => {
    return allChallenges.filter((challenge) => {
      const matchesSearch = challenge.title.toLowerCase().includes(query.toLowerCase()) ||
        challenge.description?.toLowerCase().includes(query.toLowerCase());
      const matchesGroup = selectedGroupId === "all" || challenge.groupId === selectedGroupId;
      return matchesSearch && matchesGroup;
    });
  }, [allChallenges, query, selectedGroupId]);

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6">Challenges</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search challenges…"
          className="flex-1 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10"
        />

        {/* Group Filter */}
        <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {initialGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="mb-6 text-sm text-muted-foreground">
        Showing {filteredChallenges.length} of {allChallenges.length} challenges
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No challenges found matching your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    <h3 className="font-semibold text-sm leading-tight">
                      {challenge.title}
                    </h3>
                  </div>
                  {challenge.subgroupTitle && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {challenge.groupTitle} • {challenge.subgroupTitle}
                    </p>
                  )}
                  {!challenge.subgroupTitle && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {challenge.groupTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {challenge.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {challenge.description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  {challenge.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  {challenge.difficulty}
                </span>
                {challenge.recommended && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                    Recommended
                  </span>
                )}
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full">
                  {challenge.estMins}m
                </span>
              </div>

              {/* Progress Bar */}
              <ProgressBar value={challenge.progress} />

              {/* Languages */}
              {challenge.languages.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {challenge.languages.map((lang) => (
                    <span
                      key={lang}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}

              {/* Open Button */}
              <Button size="sm" className="w-full mt-4" asChild>
                <Link href={`/platform/challenges/${challenge.slug}`}>
                  Open Challenge
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
