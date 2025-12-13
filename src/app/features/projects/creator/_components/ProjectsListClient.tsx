"use client";

import { useState } from "react";
import { useProjects } from "../_contexts/useProjects";
import { deleteProject } from "../_domain/db";
import ProjectModal from "./ProjectModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type ProjectWithRelations = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  estHours: number;
  color?: string | null;
  tags: string[];
  difficulty?: { id: string; title: string } | null;
  categories: { category: { id: string; title: string } }[];
  languages: { language: { id: string; title: string } }[];
};

export default function ProjectsListClient({
  initialDifficulties,
}: {
  initialDifficulties: { id: string; title: string; order: number }[];
}) {
  const { data: projects, isLoading, error, mutate } = useProjects();
  const [editing, setEditing] = useState<ProjectWithRelations | null>(null);
  const [creating, setCreating] = useState(false);
  const [difficulties, setDifficulties] = useState(initialDifficulties);

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      await deleteProject(id);
      mutate();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  }

  if (error) {
    return (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="text-red-500">Failed to load projects</div>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>

        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-90"
        >
          + New Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading projects...</div>
      ) : !projects || projects.length === 0 ? (
        <div className="text-center py-10 text-neutral-500">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project: ProjectWithRelations) => (
            <Card
              key={project.id}
              className={`
                relative overflow-hidden border border-black/10 dark:border-white/10 
                rounded-2xl transition-all duration-300 hover:shadow-lg
                ${
                  project.color
                    ? `bg-gradient-to-br ${project.color}`
                    : "bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800"
                }
              `}
            >
              <CardHeader className="space-y-1 pb-3">
                <h2 className="text-lg font-semibold">{project.title}</h2>
                {project.description && (
                  <p className="text-sm opacity-80 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Estimated Hours */}
                <div className="text-sm font-medium">
                  {project.estHours} hour{project.estHours !== 1 ? "s" : ""}
                </div>

                {/* Difficulty */}
                {project.difficulty && (
                  <div>
                    <Badge variant="secondary" className="rounded-full px-2 py-1">
                      {project.difficulty.title}
                    </Badge>
                  </div>
                )}

                {/* Categories */}
                {project.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.categories.map((pc) => (
                      <Badge
                        key={pc.category.id}
                        variant="outline"
                        className="rounded-full px-2 py-1 text-xs"
                      >
                        {pc.category.title}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Languages */}
                {project.languages.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.languages.map((pl) => (
                      <Badge
                        key={pl.language.id}
                        variant="secondary"
                        className="rounded-full px-2 py-1 text-xs"
                      >
                        {pl.language.title}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 5).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-md px-2 py-1 text-xs opacity-80"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {project.tags.length > 5 && (
                      <Badge
                        variant="outline"
                        className="rounded-md px-2 py-1 text-xs opacity-60"
                      >
                        +{project.tags.length - 5}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="text-xs opacity-60 mt-1">Slug: {project.slug}</div>
              </CardContent>

              <CardFooter className="flex justify-between pt-3">
                <Link href={`/creator/projects/project/${project.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Work on Project
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(project)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(project.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE Modal */}
      {creating && (
        <ProjectModal
          project={null}
          difficulties={difficulties}
          onClose={() => setCreating(false)}
          onCreated={(p) => {
            mutate();
            setCreating(false);
          }}
          onUpdated={() => {}}
        />
      )}

      {/* EDIT Modal */}
      {editing && (
        <ProjectModal
          project={editing}
          difficulties={difficulties}
          onClose={() => setEditing(null)}
          onCreated={() => {}}
          onUpdated={(updated) => {
            mutate();
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

