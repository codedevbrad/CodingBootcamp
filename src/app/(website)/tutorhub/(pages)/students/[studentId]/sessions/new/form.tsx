"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createSession } from "@/app/features/subscription/tutored/connection/tutor/db/db.sessions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SessionLength } from "@prisma/client";
import CategoryMultiSelect from "@/app/features/categories/_shared/_components/categorySelect";

type CreateSessionFormProps = {
  studentId: string;
};

export default function CreateSessionForm({
  studentId,
}: CreateSessionFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");
  const [length, setLength] = useState<SessionLength>(SessionLength.MAX60);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [preSessionNotes, setPreSessionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!startTime) {
      toast.error("Start time is required");
      return;
    }

    // Combine date with time
    const combinedDateTime = new Date(startTime);
    combinedDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    if (combinedDateTime < new Date()) {
      toast.error("Start time must be in the future");
      return;
    }

    setIsSubmitting(true);

    try {
      await createSession(studentId, {
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: combinedDateTime,
        length: length,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        preSessionNotes: preSessionNotes.trim() ? { content: preSessionNotes.trim() } : undefined,
      });

      toast.success("Session scheduled successfully!");
      router.push(`/tutorhub/students/${studentId}/sessions`);
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
        <CardDescription>
          Fill in the details to schedule a new tutoring session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to React Hooks"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for the session"
              rows={3}
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startTime ? format(startTime, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startTime}
                  onSelect={setStartTime}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Start Time */}
          {startTime && (
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <div className="flex items-center gap-2">
                <Select value={startHour} onValueChange={setStartHour}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map(
                      (hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <span className="text-lg">:</span>
                <Select value={startMinute} onValueChange={setStartMinute}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["00", "15", "30", "45"].map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Session Length */}
          <div className="space-y-2">
            <Label>Session Length *</Label>
            <Select
              value={length}
              onValueChange={(value) => setLength(value as SessionLength)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SessionLength.MAX60}>60 minutes</SelectItem>
                <SelectItem value={SessionLength.MAX90}>90 minutes</SelectItem>
                <SelectItem value={SessionLength.MAX120}>120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <CategoryMultiSelect
              selected={categoryIds}
              onChange={setCategoryIds}
            />
          </div>

          {/* Pre-Session Notes */}
          <div className="space-y-2">
            <Label htmlFor="preSessionNotes">Pre-Session Notes</Label>
            <Textarea
              id="preSessionNotes"
              value={preSessionNotes}
              onChange={(e) => setPreSessionNotes(e.target.value)}
              placeholder="Optional notes or agenda for the session"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tutorhub/students/${studentId}/sessions`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Session"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

