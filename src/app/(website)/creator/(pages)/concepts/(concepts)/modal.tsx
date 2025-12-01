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

import {
  createConcept,
  updateConcept,
  deleteConcept,
} from "../db";

import { slugify } from "@/lib/utils";

export default function ConceptModal({
  mode,
  concept,
  onSaved,
}: {
  mode: "create" | "edit";
  concept?: any;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(concept?.title ?? "");
  const [slug, setSlug] = useState(concept?.key ?? "");
  const [description, setDescription] = useState(concept?.description ?? "");
  const [loading, setLoading] = useState(false);

  // 🔥 MAIN CHANGE — auto-slugify
  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    setSlug(slugify(newTitle));
  }

  async function handleSave() {
    try {
      setLoading(true);

      const data = {
        title,
        description,
        key: slug, // 👈 pass slug properly
      };

      if (mode === "create") {
        await createConcept(data);
      } else {
        await updateConcept(concept.id, data);
      }

      onSaved();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!concept) return;

    try {
      setLoading(true);
      await deleteConcept(concept.id);
      onSaved();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>Create Concept</Button>
        ) : (
          <Button variant="ghost" size="sm">Edit</Button>
        )}
      </DialogTrigger>

      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Concept" : "Edit Concept"}
          </DialogTitle>
        </DialogHeader>

        {/* FORM FIELDS */}
        <div className="space-y-4">

          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter concept title..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          {/* SLUG (readonly) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Key (slug)</label>
            <Input value={slug} disabled className="bg-zinc-100 dark:bg-zinc-800" />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe this concept (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between pt-4">

          {mode === "edit" && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
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
