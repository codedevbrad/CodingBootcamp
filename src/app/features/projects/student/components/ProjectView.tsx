"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { BookOpen, Video, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

type ProjectContent = {
  resources?: Resource[];
  sections?: Section[];
};

type ProjectWithRelations = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  estHours: number;
  color?: string | null;
  tags: string[];
  content?: ProjectContent;
  difficulty?: { id: string; title: string } | null;
  categories: { category: { id: string; title: string } }[];
  languages: { language: { id: string; title: string } }[];
  updatedAt: Date;
};

type Resource = {
  id: string;
  type: "article" | "video";
  title: string;
  url: string;
};

type Section = {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  requirements: string[];
  hints: string[];
};

export default function ProjectView({
  project,
}: {
  project: ProjectWithRelations;
}) {
  const content = project.content as
    | { resources?: Resource[]; sections?: Section[] }
    | undefined;

  const resources = content?.resources || [];
  const sections = content?.sections || [];

  const gradient =
    project.color ||
    "from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Project Header */}
      <div
        className={`rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br ${gradient} p-6`}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories.map((pc) => (
            <Badge key={pc.category.id} variant="secondary">
              {pc.category.title}
            </Badge>
          ))}
          {project.difficulty && (
            <Badge variant="outline">{project.difficulty.title}</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        {project.description && (
          <p className="text-lg opacity-80 mb-4">{project.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-white/60 dark:bg-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.languages.map((pl) => (
            <Badge key={pl.language.id} variant="outline" className="text-xs">
              {pl.language.title}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm opacity-70">
          <span>~{project.estHours} hours</span>
          <span>•</span>
          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Resources */}
      {resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-black/10 dark:border-white/10"
              >
                {resource.type === "video" ? (
                  <Video className="w-5 h-5 mt-0.5 text-blue-600" />
                ) : (
                  <BookOpen className="w-5 h-5 mt-0.5 text-green-600" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{resource.title}</h4>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {resource.url}
                  </a>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      {sections.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Sections</h2>
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <p className="text-sm opacity-80 mt-2">
                    {section.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tasks */}
                {section.tasks && section.tasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">Tasks</h3>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {section.tasks.map((task, idx) => (
                        <li key={idx} className="text-sm">
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {section.requirements && section.requirements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold">Requirements</h3>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {section.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hints */}
                {section.hints && section.hints.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold">Hints</h3>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {section.hints.map((hint, idx) => (
                        <li key={idx} className="text-sm opacity-80">
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <p>No sections available yet. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

