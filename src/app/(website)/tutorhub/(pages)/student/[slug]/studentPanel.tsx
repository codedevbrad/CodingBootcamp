"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useStudentHomework } from "../../../db/homework/getHomework/hook";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronDown,
  List as ListIcon,
  Grid2X2,
  RefreshCw,
  Filter,
  X,
  Plus,
} from "lucide-react";

// Optional: if you have a Calendar component in your shadcn stack
import { Calendar } from "@/components/ui/calendar";

// Optional: your create modal (kept same API)
import { CreateHomeworkModal } from "./createHomework";
import { HomeworkCard } from "../../../db/homework/ui.homeworkCard";

type HomeworkItem = {
  id: string;
  title: string;
  description?: string | null;
  status:
    | "COMPLETED"
    | "IN_PROGRESS"
    | "ASSIGNED"
    | "SUBMITTED"
    | "RETURNED"
    | "CANCELLED"
    | "DRAFT";
  dueDate?: string | null;   // ISO
  createdAt: string;         // ISO
  tasks?: any[] | null;
};

// ---------- Helpers ----------
const STATUS_OPTIONS: HomeworkItem["status"][] = [
  "IN_PROGRESS",
  "ASSIGNED",
  "SUBMITTED",
  "RETURNED",
  "COMPLETED",
  "CANCELLED",
  "DRAFT",
];

const statusTone: Record<HomeworkItem["status"], "default" | "secondary" | "outline" | "destructive"> = {
  COMPLETED: "default",
  IN_PROGRESS: "secondary",
  ASSIGNED: "outline",
  SUBMITTED: "secondary",
  RETURNED: "destructive",
  CANCELLED: "destructive",
  DRAFT: "outline",
};

function toDate(d?: string | null) {
  return d ? new Date(d) : undefined;
}

function withinRange(date?: Date, from?: Date, to?: Date) {
  if (!date) return true;
  if (from && date < stripTime(from)) return false;
  if (to && date > endOfDay(to)) return false;
  return true;
}
function stripTime(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

type SortKey = "newest" | "oldest" | "due" | "title";

export function HomeworkPanel({ studentId }: { studentId: string }) {
  const { homework, isLoading, isValidating, error, mutate } = useStudentHomework(studentId);

  // ---------- Filters & UI State ----------
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<HomeworkItem["status"] | "ALL">("ALL");
  const [hasTasksOnly, setHasTasksOnly] = useState(false);
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const clearFilters = () => {
    setQuery("");
    setStatus("ALL");
    setHasTasksOnly(false);
    setFrom(undefined);
    setTo(undefined);
    setSort("newest");
  };

  // ---------- Derived list ----------
  const items: HomeworkItem[] = useMemo(
    () =>
      (homework ?? []).map((h: any) => ({
        ...h,
        tasks: Array.isArray(h?.tasks) ? h.tasks : [], // guard
      })),
    [homework]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((h) => {
      const matchesText =
        !q ||
        h.title.toLowerCase().includes(q) ||
        (h.description ?? "").toLowerCase().includes(q);
      const matchesStatus = status === "ALL" ? true : h.status === status;
      const matchesTasks = hasTasksOnly ? (h.tasks?.length ?? 0) > 0 : true;
      const due = toDate(h.dueDate);
      const matchesRange = withinRange(due, from, to);
      return matchesText && matchesStatus && matchesTasks && matchesRange;
    });

    // sort
    list = list.sort((a, b) => {
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
      if (sort === "due") {
        const ad = toDate(a.dueDate)?.getTime() ?? Infinity;
        const bd = toDate(b.dueDate)?.getTime() ?? Infinity;
        return ad - bd;
      }
      // title
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [items, query, status, hasTasksOnly, from, to, sort]);

  // ---------- UI ----------
  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-xl">Homework</CardTitle>
          <div className="text-xs text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} shown of ${items.length}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            disabled={isValidating}
            className="gap-2"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <CreateHomeworkModal
            studentId={studentId}
            onCreated={() => mutate()}
            trigger={
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white border-0 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600"
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            }
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="rounded-md border p-3">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            {/* Search */}
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search title or description…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="min-w-[200px]">
              <Label>Status</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {status === "ALL" ? "All" : status}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant={status === "ALL" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setStatus("ALL")}
                    >
                      All
                    </Button>
                    {STATUS_OPTIONS.map((s) => (
                      <Button
                        key={s}
                        variant={status === s ? "default" : "ghost"}
                        size="sm"
                        className="justify-start"
                        onClick={() => setStatus(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date range */}
            <div className="flex gap-2">
              <div>
                <Label>Due from</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[160px] justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {from ? from.toLocaleDateString() : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    {typeof Calendar !== "undefined" ? (
                      <Calendar mode="single" selected={from} onSelect={setFrom} initialFocus />
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">Calendar not installed.</div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Due to</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[160px] justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {to ? to.toLocaleDateString() : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    {typeof Calendar !== "undefined" ? (
                      <Calendar mode="single" selected={to} onSelect={setTo} initialFocus />
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">Calendar not installed.</div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Has tasks */}
            <div className="min-w-[160px]">
              <Label>Filters</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <Filter className="h-4 w-4 mr-2" />
                    {hasTasksOnly ? "Has tasks" : "All items"}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px]">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant={hasTasksOnly ? "ghost" : "default"}
                      onClick={() => setHasTasksOnly(false)}
                    >
                      All items
                    </Button>
                    <Button
                      size="sm"
                      variant={hasTasksOnly ? "default" : "ghost"}
                      onClick={() => setHasTasksOnly(true)}
                    >
                      Has tasks
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort + View */}
            <div className="flex gap-2">
              <div>
                <Label>Sort</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[170px] justify-between">
                      {sort === "newest"
                        ? "Newest"
                        : sort === "oldest"
                        ? "Oldest"
                        : sort === "due"
                        ? "Due soon"
                        : "Title A–Z"}
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[170px]">
                    <div className="flex flex-col gap-1">
                      {[
                        ["newest", "Newest"],
                        ["oldest", "Oldest"],
                        ["due", "Due soon"],
                        ["title", "Title A–Z"],
                      ].map(([key, label]) => (
                        <Button
                          key={key}
                          size="sm"
                          variant={sort === (key as SortKey) ? "default" : "ghost"}
                          onClick={() => setSort(key as SortKey)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>View</Label>
                <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="grid" className="flex gap-2">
                      <Grid2X2 className="h-4 w-4" /> Grid
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex gap-2">
                      <ListIcon className="h-4 w-4" /> List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {query && (
              <Badge variant="secondary" className="gap-1">
                “{query}”
                <Button variant="ghost" size="sm" className="h-5 px-1" onClick={() => setQuery("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {status !== "ALL" && (
              <Badge variant={statusTone[status]} className="gap-1">
                {status}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1"
                  onClick={() => setStatus("ALL")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {(from || to) && (
              <Badge variant="outline" className="gap-1">
                Due {from ? from.toLocaleDateString() : "…"} → {to ? to.toLocaleDateString() : "…"}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1"
                  onClick={() => {
                    setFrom(undefined);
                    setTo(undefined);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {hasTasksOnly && (
              <Badge variant="outline" className="gap-1">
                Has tasks
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1"
                  onClick={() => setHasTasksOnly(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {(query || status !== "ALL" || hasTasksOnly || from || to) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Separator />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">Failed to load homework. Try refresh.</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No homework matches your filters.
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((h) => (
              <HomeworkCard
                key={h.id}
                id={h.id}
                title={h.title}
                description={h.description ?? ""}
                status={h.status}
                dueDate={h.dueDate}
                createdAt={h.createdAt}
                tasks={h.tasks ?? []}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((h) => (
              <div key={h.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{h.title}</div>
                  <Badge variant={statusTone[h.status]}>{h.status}</Badge>
                </div>
                {h.description ? (
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {h.description}
                  </div>
                ) : null}
                <div className="mt-2 text-xs text-muted-foreground">
                  Created {new Date(h.createdAt).toLocaleString()}
                  {h.dueDate && ` • Due ${new Date(h.dueDate).toLocaleDateString()}`}
                  {h.tasks && h.tasks.length > 0 && ` • ${h.tasks.length} task${h.tasks.length > 1 ? "s" : ""}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
