"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { updateProjectContent } from "../_domain/db";

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

type ProjectContent = {
  resources?: Resource[];
  sections?: Section[];
};

export default function ProjectContentAdmin({
  projectId,
  initialContent,
}: {
  projectId: string;
  initialContent: any;
}) {
  const router = useRouter();
  const [content, setContent] = useState<ProjectContent>(() => {
    if (initialContent && typeof initialContent === "object") {
      return {
        resources: initialContent.resources || [],
        sections: initialContent.sections || [],
      };
    }
    return { resources: [], sections: [] };
  });

  const [saving, setSaving] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProjectContent(projectId, content);
      router.refresh();
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content");
    } finally {
      setSaving(false);
    }
  }

  // Resources
  function addResource() {
    const newResource: Resource = {
      id: `resource-${Date.now()}`,
      type: "article",
      title: "",
      url: "",
    };
    setContent({
      ...content,
      resources: [...(content.resources || []), newResource],
    });
    setEditingResource(newResource.id);
  }

  function updateResource(id: string, updates: Partial<Resource>) {
    setContent({
      ...content,
      resources: (content.resources || []).map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    });
  }

  function deleteResource(id: string) {
    setContent({
      ...content,
      resources: (content.resources || []).filter((r) => r.id !== id),
    });
    if (editingResource === id) setEditingResource(null);
  }

  // Sections
  function addSection() {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "",
      description: "",
      tasks: [],
      requirements: [],
      hints: [],
    };
    setContent({
      ...content,
      sections: [...(content.sections || []), newSection],
    });
    setEditingSection(newSection.id);
  }

  function updateSection(id: string, updates: Partial<Section>) {
    setContent({
      ...content,
      sections: (content.sections || []).map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  }

  function deleteSection(id: string) {
    setContent({
      ...content,
      sections: (content.sections || []).filter((s) => s.id !== id),
    });
    if (editingSection === id) setEditingSection(null);
  }

  // Array helpers for tasks, requirements, hints
  function addArrayItem(
    sectionId: string,
    field: "tasks" | "requirements" | "hints"
  ) {
    const section = content.sections?.find((s) => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      [field]: [...(section[field] || []), ""],
    });
  }

  function updateArrayItem(
    sectionId: string,
    field: "tasks" | "requirements" | "hints",
    index: number,
    value: string
  ) {
    const section = content.sections?.find((s) => s.id === sectionId);
    if (!section) return;

    const updated = [...(section[field] || [])];
    updated[index] = value;

    updateSection(sectionId, { [field]: updated });
  }

  function deleteArrayItem(
    sectionId: string,
    field: "tasks" | "requirements" | "hints",
    index: number
  ) {
    const section = content.sections?.find((s) => s.id === sectionId);
    if (!section) return;

    const updated = (section[field] || []).filter((_, i) => i !== index);
    updateSection(sectionId, { [field]: updated });
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Content</h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Resources</CardTitle>
            <Button onClick={addResource} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.resources?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No resources yet. Add one to get started.
            </p>
          ) : (
            content.resources?.map((resource) => (
              <Card key={resource.id} className="p-4">
                {editingResource === resource.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Type
                      </label>
                      <select
                        value={resource.type}
                        onChange={(e) =>
                          updateResource(resource.id, {
                            type: e.target.value as "article" | "video",
                          })
                        }
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Title
                      </label>
                      <Input
                        value={resource.title}
                        onChange={(e) =>
                          updateResource(resource.id, {
                            title: e.target.value,
                          })
                        }
                        placeholder="Resource title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        URL
                      </label>
                      <Input
                        value={resource.url}
                        onChange={(e) =>
                          updateResource(resource.id, { url: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingResource(null)}
                        size="sm"
                      >
                        Done
                      </Button>
                      <Button
                        onClick={() => deleteResource(resource.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900">
                          {resource.type}
                        </span>
                        <h4 className="font-semibold">{resource.title}</h4>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {resource.url}
                      </a>
                    </div>
                    <Button
                      onClick={() => setEditingResource(resource.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Sections Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sections</CardTitle>
            <Button onClick={addSection} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.sections?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sections yet. Add one to get started.
            </p>
          ) : (
            content.sections?.map((section) => (
              <Card key={section.id} className="p-4">
                {editingSection === section.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Title
                      </label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        placeholder="Section title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Description
                      </label>
                      <Textarea
                        value={section.description}
                        onChange={(e) =>
                          updateSection(section.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Section description"
                        rows={3}
                      />
                    </div>

                    {/* Tasks */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Tasks</label>
                        <Button
                          onClick={() => addArrayItem(section.id, "tasks")}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(section.tasks || []).map((task, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={task}
                              onChange={(e) =>
                                updateArrayItem(
                                  section.id,
                                  "tasks",
                                  idx,
                                  e.target.value
                                )
                              }
                              placeholder="Task description"
                            />
                            <Button
                              onClick={() =>
                                deleteArrayItem(section.id, "tasks", idx)
                              }
                              size="sm"
                              variant="ghost"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">
                          Requirements
                        </label>
                        <Button
                          onClick={() =>
                            addArrayItem(section.id, "requirements")
                          }
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(section.requirements || []).map((req, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={req}
                              onChange={(e) =>
                                updateArrayItem(
                                  section.id,
                                  "requirements",
                                  idx,
                                  e.target.value
                                )
                              }
                              placeholder="Requirement description"
                            />
                            <Button
                              onClick={() =>
                                deleteArrayItem(
                                  section.id,
                                  "requirements",
                                  idx
                                )
                              }
                              size="sm"
                              variant="ghost"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hints */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Hints</label>
                        <Button
                          onClick={() => addArrayItem(section.id, "hints")}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(section.hints || []).map((hint, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={hint}
                              onChange={(e) =>
                                updateArrayItem(
                                  section.id,
                                  "hints",
                                  idx,
                                  e.target.value
                                )
                              }
                              placeholder="Hint description"
                            />
                            <Button
                              onClick={() =>
                                deleteArrayItem(section.id, "hints", idx)
                              }
                              size="sm"
                              variant="ghost"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setEditingSection(null)}
                        size="sm"
                      >
                        Done
                      </Button>
                      <Button
                        onClick={() => deleteSection(section.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Section
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{section.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {section.description}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{section.tasks?.length || 0} tasks</span>
                        <span>
                          {section.requirements?.length || 0} requirements
                        </span>
                        <span>{section.hints?.length || 0} hints</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setEditingSection(section.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

