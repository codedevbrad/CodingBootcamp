"use client";

import { useState, useEffect } from "react";
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
import { updateSession } from "@/app/features/subscription/tutored/connection/tutor/db/db.sessions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SessionLength, TutoringSessionStatus, Prisma } from "@prisma/client";
import CategoryMultiSelect from "@/app/features/categories/_shared/_components/categorySelect";

type Session = Prisma.TutoringSessionGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

type EditSessionFormProps = {
  studentId: string;
  sessionId: string;
  initialSession: Session;
};

export default function EditSessionForm({
  studentId,
  sessionId,
  initialSession,
}: EditSessionFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");
  const [length, setLength] = useState<SessionLength>(SessionLength.MAX60);
  const [status, setStatus] = useState<TutoringSessionStatus>(TutoringSessionStatus.PENDING);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [preSessionNotes, setPreSessionNotes] = useState("");
  const [postSessionContent, setPostSessionContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialSession) {
      setTitle(initialSession.title);
      setDescription(initialSession.description || "");
      setLength(initialSession.length);
      setStatus(initialSession.status);
      
      const sessionDate = new Date(initialSession.startTime);
      setStartTime(sessionDate);
      setStartHour(sessionDate.getHours().toString().padStart(2, "0"));
      setStartMinute(sessionDate.getMinutes().toString().padStart(2, "0"));

      if (initialSession.categories) {
        setCategoryIds(initialSession.categories.map(c => c.categoryId));
      }

      if (initialSession.preSessionNotes && typeof initialSession.preSessionNotes === 'object' && 'content' in initialSession.preSessionNotes) {
        setPreSessionNotes((initialSession.preSessionNotes as { content: string }).content || "");
      }

      if (initialSession.postSessionContent && typeof initialSession.postSessionContent === 'object' && 'content' in initialSession.postSessionContent) {
        setPostSessionContent((initialSession.postSessionContent as { content: string }).content || "");
      }
    }
  }, [initialSession]);

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

    setIsSubmitting(true);

    try {
      await updateSession(sessionId, studentId, {
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: combinedDateTime,
        length: length,
        status: status,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        preSessionNotes: preSessionNotes.trim() ? { content: preSessionNotes.trim() } : undefined,
        postSessionContent: postSessionContent.trim() ? { content: postSessionContent.trim() } : undefined,
      });

      toast.success("Session updated successfully!");
      router.push(`/tutorhub/students/${studentId}/sessions`);
    } catch (error) {
      console.error("Error updating session:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
        <CardDescription>
          Update the session information
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

          {/* Status */}
          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TutoringSessionStatus)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TutoringSessionStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={TutoringSessionStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={TutoringSessionStatus.CANCELLED}>Cancelled</SelectItem>
                <SelectItem value={TutoringSessionStatus.RESCHEDULED}>Rescheduled</SelectItem>
                <SelectItem value={TutoringSessionStatus.POSTPONED}>Postponed</SelectItem>
                <SelectItem value={TutoringSessionStatus.MISSED}>Missed</SelectItem>
                <SelectItem value={TutoringSessionStatus.NO_SHOW}>No Show</SelectItem>
                <SelectItem value={TutoringSessionStatus.NO_SHOW_NO_REASON}>No Show (No Reason)</SelectItem>
                <SelectItem value={TutoringSessionStatus.NO_SHOW_WITH_REASON}>No Show (With Reason)</SelectItem>
                <SelectItem value={TutoringSessionStatus.NO_SHOW_WITH_REASON_AND_RESCHEDULED}>No Show (Rescheduled)</SelectItem>
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

          {/* Post-Session Content */}
          <div className="space-y-2">
            <Label htmlFor="postSessionContent">Post-Session Notes</Label>
            <Textarea
              id="postSessionContent"
              value={postSessionContent}
              onChange={(e) => setPostSessionContent(e.target.value)}
              placeholder="Optional notes about what was covered in the session"
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
              {isSubmitting ? "Updating..." : "Update Session"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

