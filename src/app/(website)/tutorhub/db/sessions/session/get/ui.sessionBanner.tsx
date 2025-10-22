"use client";

import * as React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTutorSessions } from "../../fetchSessions/hook";

type SessionLite = {
  id: string;
  title: string;
  startTimeISO: string;
  studentName?: string | null;
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

export default function NextSessionBanner() {
  const router = useRouter();
  const { sessions = [], isLoading, mutate } = useTutorSessions();

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const nextSession: SessionLite | null = useMemo(() => {
    if (!sessions?.length) return null;
    const upcoming = sessions
      .map((s: any) => ({
        id: s.id,
        title: s.title,
        startTimeISO: s.startTimeISO ?? s.startTime ?? s.start ?? "",
        studentName: s.studentName ?? s.student?.user?.name ?? s.student?.user?.email ?? null,
      }))
      .filter((s) => s.startTimeISO)
      .map((s) => ({ ...s, start: new Date(s.startTimeISO) }))
      .filter((s) => !Number.isNaN(s.start.getTime()))
      .filter((s) => s.start.getTime() >= now.getTime())
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    if (!upcoming.length) return null;
    const first = upcoming[0];
    return {
      id: first.id,
      title: first.title,
      startTimeISO: first.start.toISOString(),
      studentName: first.studentName,
    };
  }, [sessions, now]);

  const startAt = useMemo(() => (nextSession ? new Date(nextSession.startTimeISO) : null), [nextSession]);
  const remainingMs = useMemo(() => (startAt ? Math.max(0, startAt.getTime() - now.getTime()) : 0), [startAt, now]);

  const windowMs = 30 * 60 * 1000; // 30 min pre-start window
  const progress = startAt ? Math.max(0, Math.min(1, 1 - remainingMs / windowMs)) : 0;

  const triggeredRef = useRef(false);
  useEffect(() => {
    if (!startAt) return;
    if (remainingMs === 0 && !triggeredRef.current) {
      triggeredRef.current = true;
      setTimeout(() => mutate(), 1500);
    }
  }, [remainingMs, startAt, mutate]);

  // Show only today's upcoming session
  const isToday = startAt ? startAt.toDateString() === now.toDateString() : false;
  const showContent = !!nextSession && isToday;
  const showSkeleton = isLoading && (!sessions || sessions.length === 0);
  const showNothing = !isLoading && !showContent;

  return (
    <div className="p-3">
      {/* Skeleton Loading */}
      {showSkeleton && (
        <div className="w-full bg-black/95 border border-white/10 rounded-lg overflow-hidden animate-pulse">
          <div className="px-4 py-4 md:px-6 space-y-3">
            <div className="h-4 w-28 bg-white/10 rounded" />
            <div className="h-6 w-48 bg-white/15 rounded" />
            <div className="h-4 w-36 bg-white/10 rounded" />
          </div>
          <div className="relative h-1 bg-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-white/30 to-cyan-400/30 animate-[shimmer_2s_infinite]" />
          </div>
          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>
      )}

      {/* Main Banner */}
      {showContent && (
        <div
          className={cn(
            " w-full rounded-lg border border-white/10 shadow-sm overflow-hidden",
            "bg-gradient-to-br from-neutral-950 to-neutral-900 text-white transition-all duration-300"
          )}
        >
          <div className="px-4 py-4 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-cyan-400/80 font-medium">
                Next session today
              </p>
              <h3 className="text-lg font-semibold leading-tight">
                {nextSession.title}{" "}
                {nextSession.studentName && (
                  <span className="text-white/70 font-normal">
                    with {nextSession.studentName}
                  </span>
                )}
              </h3>
              <p className="text-sm text-white/60">
                Starts at{" "}
                <span className="text-white font-medium">
                  {startAt!.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>{" "}
                · T-{formatHMS(remainingMs)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push(`/tutorhub/sessions/${nextSession.id}`)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-md shadow-md"
              >
                View Session
              </Button>
            </div>
          </div>

          {/* Sleek progress bar */}
          <div className="relative h-1 w-full bg-white/10 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 transition-[width] duration-1000 ease-linear shadow-[0_0_10px_#22d3ee]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {showNothing && null}
    </div>
  );
}
