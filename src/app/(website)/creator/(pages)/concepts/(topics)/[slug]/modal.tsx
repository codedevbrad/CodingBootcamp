"use client";

import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import LanguageMultiSelect from "@/app/features/languages/_shared/_components/languageSelect";
import CategoryMultiSelect from "@/app/features/categories/_shared/_components/categorySelect";

import {
  createTopic,
  updateTopic,
  deleteTopic,
} from "../../db";

// ... existing code ...

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function TopicModal({
  mode,
  topic,
  conceptId,
  onSaved,
}: {
  mode: "create" | "edit";
  topic?: any;
  conceptId: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(topic?.title ?? "");
  const [slug, setSlug] = useState(topic?.slug ?? "");
  const [description, setDescription] = useState(topic?.description ?? "");

  const [languageIds, setLanguageIds] = useState(
    topic?.languages?.map((l: any) => l.languageId) ?? []
  );

  const [categoryIds, setCategoryIds] = useState(
    topic?.categories?.map((c: any) => c.categoryId) ?? []
  );

  const [loading, setLoading] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(slugify(value));
  }

  async function handleSave() {
    setLoading(true);

    const data = {
      title,
      description,
      languageIds,
      categoryIds,
    };

    if (mode === "create") {
      await createTopic(conceptId, data);
    } else {
      await updateTopic(topic.id, conceptId, data);
    }

    onSaved();
    setOpen(false);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteTopic(topic.id, conceptId);
    onSaved();
    setOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>Create Topic</Button>
        ) : (
          <Button variant="ghost" size="sm">Edit</Button>
        )}
      </DialogTrigger>

      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Topic" : "Edit Topic"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Slug</label>
            <Input value={slug} disabled className="bg-zinc-100 dark:bg-zinc-800" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* LANGUAGES */}
          <LanguageMultiSelect
            selected={languageIds}
            onChange={setLanguageIds}
          />

          {/* CATEGORIES */}
          <CategoryMultiSelect
            selected={categoryIds}
            onChange={setCategoryIds}
          />
        </div>

        <div className="flex justify-between pt-4">
          {mode === "edit" && (
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          )}

          <Button onClick={handleSave} disabled={loading || !title.trim()}>
            {loading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}