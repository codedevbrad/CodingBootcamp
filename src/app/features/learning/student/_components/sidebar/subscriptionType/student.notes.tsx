"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  FileText,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  GraduationCap,
  ChevronRight,
} from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils";
import { useNotes } from "@/app/features/learning/student/_contexts/useNotes"
import {ProfileDisplayed} from "@/app/features/user/student/_components/profile/profile.inline/profile.inline.client"
import { StudentHubBtn } from "@/app/features/user/student/_components/studentHubBtn"

export function AppSidebar() {
  const pathname = usePathname();
  const { notes, add, edit, remove, isLoading } = useNotes();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  async function addPage() {
    await add("New Page");
  }

  async function savePageTitle(id: string) {
    await edit(id, { title: editValue });
    setEditingId(null);
    setEditValue("");
  }

  async function deletePage(id: string) {
    await remove(id);
  }

  const pages = notes || [];

  return (
    <Sidebar variant="inset">
      {/* HEADER */}
      <SidebarHeader className="flex flex-col items-start justify-center px-3 py-4 border-b border-border bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h1 className="text-base font-semibold text-blue-700">
            Learning Hub
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Your notes & learning pages.
        </p>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              My Pages
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={addPage}
              className="h-6 w-6 hover:bg-blue-50"
              title="Add new page"
              disabled={isLoading}
            >
              <PlusCircle className="h-4 w-4 text-blue-600" />
            </Button>
          </div>

          <SidebarGroupContent>
            {isLoading ? (
              <p className="text-xs text-muted-foreground p-3 italic">
                Loading notes...
              </p>
            ) : pages.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 italic">
                No pages yet. Click + to create one.
              </p>
            ) : (
              <ul className="space-y-2 px-2">
                <AnimatePresence>
                  {pages.map((page) => {
                    const isActive =
                      pathname === `/platform/me/notes/${page.id}` ||
                      pathname?.startsWith(`/platform/me/notes/${page.id}`);
                    const isEditing = editingId === page.id;

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
                        {isEditing ? (
                          <div className="flex items-center gap-2 p-2">
                            <input
                              className="flex-1 text-sm border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-400"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => savePageTitle(page.id)}
                            >
                              <Save className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full p-2">
                            <Link
                              href={`/platform/me/notes/${page.id}`}
                              className="flex items-center gap-2 flex-1"
                            >
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
                            </Link>

                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setEditingId(page.id);
                                  setEditValue(page.title);
                                }}
                              >
                                <Edit className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deletePage(page.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="active-bar"
                            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-md bg-blue-600"
                          />
                        )}
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* FOOTER SECTION */}
        <div className="mt-auto p-4 border-t border-border bg-gradient-to-b from-background to-slate-50">
          
          <ProfileDisplayed /> 

          <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-3 shadow-sm">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-800 mb-1">
              <GraduationCap className="h-4 w-4 text-cyan-600" />
              Continue Learning
            </h4>

            <p className="text-xs text-gray-600">
              Last session:{" "}
              <span className="font-medium text-blue-600">
                React Components
              </span>
            </p>

            <div className="py-2">
              <StudentHubBtn />
            </div>

          </div>

          <div className="mt-3 text-center text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} CodeBootcamp
          </div>
          
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

/** Wrapper for content area */
export function WithSidebarInset({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarInset className="min-h-screen">{children}</SidebarInset>;
}
