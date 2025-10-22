"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
import { useTutorSessions } from "./hook";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SessionItem = {
  id: string;
  title: string;
  startTimeISO: string; // ISO string
  length: "MIN60" | "MIN90" | "MIN120";
  student: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

function formatHMS(ms: number) {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function groupByDate(sessions: SessionItem[]) {
  const byDate = new Map<string, SessionItem[]>();
  for (const s of sessions) {
    const d = new Date(s.startTimeISO);
    const key = d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const arr = byDate.get(key) ?? [];
    arr.push(s);
    byDate.set(key, arr);
  }
  return byDate;
}

export default function TutorSessionsBoard(props: {
  fromISO?: string;
  toISO?: string;
  order?: "asc" | "desc";
  className?: string;
}) {
  const router = useRouter();
  const { sessions = [], isLoading, mutate } = useTutorSessions({
    fromISO: props.fromISO,
    toISO: props.toISO,
    order: props.order ?? "asc",
  });

  // tick every second for countdown
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Parse sessions defensively
  const parsed = useMemo<SessionItem[]>(() => {
    return sessions
      .map((s: any) => ({
        id: s.id as string,
        title: s.title as string,
        startTimeISO: (s.startTimeISO ?? s.startTime ?? s.start) as string,
        length: (s.length as SessionItem["length"]) ?? "MIN60",
        student: {
          name: s.student?.name ?? s.student?.user?.name ?? null,
          email: s.student?.email ?? s.student?.user?.email ?? null,
          image: s.student?.image ?? s.student?.user?.image ?? null,
        },
      }))
      .filter((s) => !!s.startTimeISO && !Number.isNaN(new Date(s.startTimeISO).getTime()));
  }, [sessions]);

  // Split into upcoming (>= now) and past
  const { nextUpcoming, upcomingRest, past } = useMemo(() => {
    const upcoming = parsed
      .map((s) => ({ ...s, start: new Date(s.startTimeISO) }))
      .filter((s) => s.start.getTime() >= now.getTime())
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const past = parsed
      .map((s) => ({ ...s, start: new Date(s.startTimeISO) }))
      .filter((s) => s.start.getTime() < now.getTime())
      .sort((a, b) => b.start.getTime() - a.start.getTime()); // most recent first

    const nextUpcoming = upcoming[0] ?? null;
    const upcomingRest = nextUpcoming ? upcoming.slice(1) : upcoming;

    return {
      nextUpcoming: nextUpcoming
        ? {
            ...nextUpcoming,
            startTimeISO: nextUpcoming.start.toISOString(),
          }
        : null,
      upcomingRest: upcomingRest.map((s) => ({ ...s, start: undefined })),
      past: past.map((s) => ({ ...s, start: undefined })),
    };
  }, [parsed, now]);

  // Countdown + progress for hero
  const startAt = useMemo(
    () => (nextUpcoming ? new Date(nextUpcoming.startTimeISO) : null),
    [nextUpcoming]
  );

  const remainingMs = useMemo(() => {
    if (!startAt) return 0;
    return Math.max(0, startAt.getTime() - now.getTime());
  }, [startAt, now]);

  const windowMs = 30 * 60 * 1000; // 30 min window bar
  const progress = startAt ? Math.max(0, Math.min(1, 1 - remainingMs / windowMs)) : 0;

  // After countdown hits 0, refresh once
  useEffect(() => {
    if (!startAt) return;
    if (remainingMs === 0) {
      const t = setTimeout(() => mutate(), 1500);
      return () => clearTimeout(t);
    }
  }, [remainingMs, startAt, mutate]);

  // Group rest by date
  const groupedUpcoming = useMemo(() => groupByDate(upcomingRest), [upcomingRest]);
  const groupedPast = useMemo(() => groupByDate(past), [past]);

  // Skeleton
  if (isLoading && sessions.length === 0) {
    return (
      <div className={cn("space-y-6", props.className)}>
        <div className="rounded-xl border bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 text-white">
          <div className="h-5 w-32 bg-white/30 rounded mb-2 animate-pulse" />
          <div className="h-7 w-72 bg-white/30 rounded mb-2 animate-pulse" />
          <div className="h-4 w-40 bg-white/30 rounded animate-pulse" />
          <div className="mt-3 h-1 w-full bg-white/20 rounded overflow-hidden">
            <div className="h-full bg-white/50 w-1/3 animate-pulse" />
          </div>
        </div>

        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-40 bg-muted rounded" />
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="flex items-center justify-between rounded-xl border p-4 bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div>
                    <div className="h-4 w-48 bg-muted rounded mb-1" />
                    <div className="h-3 w-32 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-9 w-28 bg-muted rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", props.className)}>
      {/* ===== Next Upcoming (Hero) ===== */}
      {nextUpcoming ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border",
            "bg-gradient-to-br from-blue-600 via-purple-600 to-fuchsia-600",
            "text-white shadow-lg"
          )}
        >
          <div className="px-5 py-5 md:px-8 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider opacity-90">Next session</p>
              <h2 className="text-2xl font-bold leading-tight">
                {nextUpcoming.title}
              </h2>
              <p className="text-sm opacity-95">
                {startAt!.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}{" "}
                at{" "}
                {startAt!.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" · "}
                <span className="font-semibold">
                  T-{formatHMS(remainingMs)}
                </span>
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-black">
                  {nextUpcoming.length.replace("MIN", "")} min
                </Badge>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={nextUpcoming.student.image ?? undefined} />
                  <AvatarFallback>
                    {(nextUpcoming.student.name?.split(" ").map((p) => p[0]).join("") ||
                      nextUpcoming.student.email?.[0] ||
                      "?"
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {nextUpcoming.student.name ?? nextUpcoming.student.email ?? "Student"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="text-black"
                onClick={() => router.push(`/tutorhub/sessions/${nextUpcoming.id}`)}
              >
                Open session
              </Button>
            </div>
          </div>

          {/* progress bar */}
          <div className="h-1 w-full bg-white/20">
            <div
              className="h-full bg-white/90"
              style={{ width: `${progress * 100}%`, transition: "width 1s linear" }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border p-6 text-sm text-muted-foreground">
          No upcoming sessions.
        </div>
      )}

      {/* ===== Upcoming (rest) ===== */}
      {upcomingRest.length > 0 && (
        <Section
          title="Upcoming"
          groups={groupedUpcoming}
          router={router}
          emptyText="No other upcoming sessions."
        />
      )}

      {/* ===== Past ===== */}
      <Section
        title="Past"
        groups={groupedPast}
        router={router}
        emptyText="No past sessions."
      />
    </div>
  );
}

/** Reusable section rendering grouped sessions with nicer cards */
function Section({
  title,
  groups,
  router,
  emptyText,
}: {
  title: string;
  groups: Map<string, SessionItem[]>;
  router: ReturnType<typeof useRouter>;
  emptyText: string;
}) {
  const entries = Array.from(groups.entries());
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        entries.map(([dateLabel, items]) => (
          <div key={dateLabel} className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground/90">
              {dateLabel}
            </div>
            <div className="grid gap-2">
              {items
                .slice()
                // sort within day by time ascending
                .sort(
                  (a, b) =>
                    new Date(a.startTimeISO).getTime() - new Date(b.startTimeISO).getTime()
                )
                .map((s) => {
                  const start = new Date(s.startTimeISO);
                  const timeLabel = start.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const initials =
                    (s.student.name?.split(" ").map((p) => p[0]).join("") ||
                      s.student.email?.[0] ||
                      "?"
                    ).toUpperCase();

                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "group relative overflow-hidden rounded-xl border bg-card/60 p-4",
                        "transition-all duration-200 hover:shadow-md",
                        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-200",
                        "before:bg-gradient-to-r before:from-blue-500/10 before:via-purple-500/10 before:to-fuchsia-500/10",
                        "hover:before:opacity-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={s.student.image ?? undefined} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium leading-tight">
                              {s.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {timeLabel} ·{" "}
                              {s.student.name ?? s.student.email ?? "Student"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {s.length.replace("MIN", "")} min
                          </Badge>
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/tutorhub/sessions/${s.id}`)}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
