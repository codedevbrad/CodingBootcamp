"use client"

import { Timer, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  title: string;
  difficulty?: string;
  estMins?: number;
  onTestClick?: () => void;
}

export default function TopicBottomBar({
  title,
  difficulty = "Beginner",
  estMins = 5,
  onTestClick,
}: Props) {
  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-40",
        "w-[95%] md:w-[700px] lg:w-[800px]"
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-5 py-4 shadow-xl border",
          "bg-white/80 dark:bg-black/50 backdrop-blur-xl",
          "border-black/10 dark:border-white/10",
          "flex items-center justify-between gap-4"
        )}
      >
        {/* Left section — Title & Meta */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-base font-bold truncate">{title}</h3>

          <div className="flex items-center gap-3 text-xs opacity-80 mt-0.5">
            {/* Difficulty */}
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {difficulty}
            </span>

            {/* Est. Minutes */}
            <span className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {estMins}m
            </span>
          </div>
        </div>

        {/* Right — Button */}
        <Link href={`/platform/challengeme/${title.toLowerCase().replace(/\s+/g, "-")}`}>
            <Button
              onClick={onTestClick}
              className={cn(
                "rounded-xl px-5 py-2 text-sm font-medium",
                "bg-gradient-to-r from-blue-600 to-indigo-600",
                "hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
              )}
            >
              Take Test
            </Button>
        </Link>
      </div>
    </div>
  );
}
