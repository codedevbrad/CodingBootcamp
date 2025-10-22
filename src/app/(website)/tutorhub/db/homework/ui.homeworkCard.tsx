"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronDown, CalendarDays } from "lucide-react";
import { HomeworkStatus } from "@/generated/prisma";

type Task = { text: string; done?: boolean };

export type HomeworkCardProps = {
  id: string;
  title: string;
  description?: string | null;
  status: HomeworkStatus
  dueDate?: string | null;
  createdAt?: string | null;
  tasks?: unknown; // can be anything coming from JSON — we’ll normalize
};


/* ---------- utils ---------- */

function statusVariant(
  s: HomeworkCardProps["status"]
): React.ComponentProps<typeof Badge>["variant"] {
  switch (s) {
    case "COMPLETED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "ASSIGNED":
      return "outline";
    case "SUBMITTED":
      return "secondary";
    case "RETURNED":
      return "destructive";
    case "CANCELLED":
      return "destructive";
    case "DRAFT":
      return "outline";
    default:
      return "outline";
  }
}


function formatDate(input?: string | null) {
  if (!input) return "—";
  const d = new Date(input);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Accepts anything, returns Task[] safely */
function normalizeTasks(raw: unknown): Task[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    // ensure elements are objects with text
    return raw
      .map((t) => {
        if (t && typeof t === "object") {
          const tt = t as any;
          const text = typeof tt.text === "string" ? tt.text : "";
          const done = !!tt.done;
          return { text, done };
        }
        return { text: "", done: false };
      })
      .filter((t) => t.text.trim().length > 0);
  }
  // handle cases where JSON might be returned as a plain object or stringified
  try {
    const parsed =
      typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (Array.isArray(parsed)) return normalizeTasks(parsed);
  } catch {
    // ignore
  }
  return [];
}

/* ---------- component ---------- */
export function HomeworkCard({
  title,
  description,
  status,
  dueDate,
  createdAt,
  tasks,
}: HomeworkCardProps) {
  const [open, setOpen] = React.useState(false);

  const safeTasks = normalizeTasks(tasks);
  const total = safeTasks.length;
  const done = safeTasks.filter((t) => !!t.done).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  const isOverdue =
    !!dueDate &&
    new Date(dueDate).setHours(23, 59, 59, 999) < Date.now() &&
    status !== "COMPLETED";

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isOverdue ? "border-destructive/50" : ""
      }`}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-6">{title}</CardTitle>
          <Badge variant={statusVariant(status)} className="shrink-0">
            {status.replaceAll("_", " ")}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>Due: {formatDate(dueDate)}</span>
          <span className="mx-1">•</span>
          <span>Created: {formatDate(createdAt ?? null)}</span>
        </div>

        {isOverdue && (
          <div className="text-xs text-destructive">Overdue</div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {description && (
          <>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Separator />
          </>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>
              {done}/{total} ({progress}%)
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Tasks (collapsible) */}
        {total > 0 ? (
          <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tasks</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  {open ? "Hide" : "Show"} tasks
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-2">
              {safeTasks.map((t, i) => (
                <label key={i} className="flex items-start gap-2 text-sm">
                  <Checkbox checked={!!t.done} disabled />
                  <span
                    className={t.done ? "line-through text-muted-foreground" : ""}
                  >
                    {t.text}
                  </span>
                </label>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <p className="text-sm text-muted-foreground">No tasks.</p>
        )}
      </CardContent>
    </Card>
  );
}
