"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  FileText,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

import {ProfileDisplayed} from "@/app/features/user/student/_components/profile/profile.inline/profile.inline.client"

export function GuestNotesSidebar() {
  const pathname = usePathname();

  const demoPages = [
    { id: "intro", title: "How Notes Work" },
    { id: "tips", title: "Better Study Tips" },
    { id: "features", title: "Using Page Blocks" },
  ];

  return (
    <Sidebar variant="inset">
      {/* HEADER */}
      <SidebarHeader className="flex flex-col items-start justify-center px-3 py-4 border-b border-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h1 className="text-base font-semibold text-blue-700">
            Guest Notes
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Explore how notes work before you sign in.
        </p>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="flex flex-col justify-between">

        <SidebarGroup>
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Demo Pages
            </h2>
          </div>

          <SidebarGroupContent>
            <ul className="space-y-2 px-2">
              {demoPages.map((page) => {
                const isActive = pathname?.includes(page.id);

                return (
                  <motion.li
                    key={page.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "group relative rounded-md transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-100 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    )}
                  >
                    <Link
                      href={`/platform/me/notes/guest/${page.id}`}
                      className="flex items-center justify-between w-full p-2"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className={cn(
                            "flex items-center justify-center h-7 w-7 rounded-md border text-blue-600 bg-blue-50",
                            isActive &&
                              "bg-blue-600 text-white border-blue-600"
                          )}
                        >
                          <FileText className="h-4 w-4" />
                        </div>

                        <span
                          className={cn(
                            "truncate text-sm font-medium",
                            isActive
                              ? "text-blue-700"
                              : "text-gray-700 group-hover:text-gray-900"
                          )}
                        >
                          {page.title}
                        </span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="active-bar"
                          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-md bg-blue-600"
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GUEST ONBOARDING CARD */}
        <div className="mt-auto p-4 border-t border-border bg-gradient-to-b from-background to-slate-50">

          <ProfileDisplayed />

          <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50/60 via-cyan-50/60 to-indigo-50/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle className="h-5 w-5 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-800">
                Notes Video Guide
              </h4>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Learn how students use Notes to organise learning, track content, and build study pages.
            </p>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all rounded-md"
              size="sm"
              asChild
            >
              <Link href="/platform/me/notes/guest/guide">
                Watch Guide
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-3 text-center text-[11px] text-muted-foreground">
            Guest Mode — Sign in to save real notes
          </div>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

export function GuestSidebarInset({ children }: { children: React.ReactNode }) {
  return <SidebarInset className="min-h-screen">{children}</SidebarInset>;
}
