"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { updateInspiration } from "../../db/inspiration";
import { Loader2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

const AVAILABLE_TAGS = [
  "header",
  "admin",
  "dashboard",
  "hero",
  "landing",
  "marketing",
];
const AVAILABLE_TYPES = ["ui", "quote", "tip", "story"];

export default function InspirationEdit({ inspiration }: { inspiration: any }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(inspiration.title);
  const [content, setContent] = useState(inspiration.content?.text ?? "");
  const [tags, setTags] = useState<string[]>(inspiration.tags ?? []);
  const [type, setType] = useState<string | undefined>(inspiration.type ?? "ui");
  const [imageUrl, setImageUrl] = useState(inspiration.sourceUrl ?? "");
  const [isPending, startTransition] = useTransition();

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await updateInspiration(inspiration.id, {
        title,
        content: { text: content },
        sourceUrl: imageUrl || null,
        tags,
        type,
      });

      // ✅ optional: show a "Saved!" state before closing
      setTimeout(() => setOpen(false), 400);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4 text-blue-500" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col h-screen border-l bg-background"
      >
        <SheetHeader className="p-6 pb-2 border-b">
          <SheetTitle>Edit Inspiration</SheetTitle>
        </SheetHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Content</label>
            <Textarea
              placeholder="What inspired you?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Type Selector */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Type</label>
            <Select onValueChange={setType} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Tags</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={active ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer select-none transition",
                      active && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {active && <X className="w-3 h-3 ml-1 opacity-60" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Image URL Input + Preview */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Image URL</label>
            <Input
              placeholder="Paste your image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value.trim())}
            />
            {imageUrl && (
              <div className="mt-2 relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md border"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Sticky footer */}
        <SheetFooter className="border-t p-6 bg-background">
          <Button
            onClick={handleSubmit}
            disabled={isPending || !title.trim()}
            className="w-full"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
