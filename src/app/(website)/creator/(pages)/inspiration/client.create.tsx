"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { createInspiration } from "../../db/inspiration";
import { Loader2, Plus, X } from "lucide-react";
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

export default function InspirationCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<string | undefined>();
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await createInspiration({
        title,
        content: { text: content },
        sourceUrl: imageUrl || undefined,
        tags,
        type,
      });

      setTitle("");
      setContent("");
      setTags([]);
      setType(undefined);
      setImageUrl("");
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Inspiration
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-3">
        <h3 className="font-medium text-lg">New Inspiration</h3>

        {/* Title */}
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content */}
        <Textarea
          placeholder="What inspired you?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

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

        {/* Tag Selector */}
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

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={isPending || !title.trim()}
          className="w-full"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
