"use client";

import * as React from "react";
import { useTransition, useState } from "react";
import { Users } from "lucide-react";
import { createTutoringSession } from "./query";

// ShadCN UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Reusable selector
import { StudentSelect } from "../../../students/getStudents/ui";

type Minutes = 60 | 90 | 120;

export default function CreateNewSessionModal() {
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  // we only keep the chosen id in the parent now
  const [studentProfileId, setStudentProfileId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTimeLocal, setStartTimeLocal] = useState("");
  const [lengthMinutes, setLengthMinutes] = useState<Minutes>(60);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTimeLocal("");
    setLengthMinutes(60);
    setStudentProfileId(null);
  };

  const submit = () => {
    if (!studentProfileId) return alert("Pick a student");
    if (!title || !startTimeLocal) return alert("Title and start time are required");

    // Convert local input (yyyy-MM-ddTHH:mm) to ISO
    const startISO = new Date(startTimeLocal).toISOString();

    startTransition(async () => {
      try {
        await createTutoringSession({
          studentProfileId,
          title,
          description,
          startTimeISO: startISO,
          lengthMinutes,
        });
        resetForm();
        setOpen(false);
        // toast.success("Session created")
      } catch (e: any) {
        alert(e?.message ?? "Failed to create session");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Fancy trigger button */}
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
        >
          <Users className="mr-2 h-4 w-4" />
          Start New Session
        </Button>
      </DialogTrigger>

      {/* Modal content */}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Start a New Tutoring Session</DialogTitle>
          <DialogDescription>
            Schedule a new session with one of your assigned students.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Student select (reusable) */}
          <StudentSelect
            value={studentProfileId}
            onChange={(id) => setStudentProfileId(id)}
          />

          {/* Title */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Algebra fundamentals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Fractions → equations → quick quiz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Start time */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Start time</label>
            <Input
              type="datetime-local"
              value={startTimeLocal}
              onChange={(e) => setStartTimeLocal(e.target.value)}
            />
          </div>

          {/* Length */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Length</label>
            <div className="flex gap-2">
              {[60, 90, 120].map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={lengthMinutes === (m as Minutes) ? "default" : "outline"}
                  onClick={() => setLengthMinutes(m as Minutes)}
                >
                  {m} min
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={isPending || !studentProfileId || !title || !startTimeLocal}
            >
              {isPending ? "Creating…" : "Create Session"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
