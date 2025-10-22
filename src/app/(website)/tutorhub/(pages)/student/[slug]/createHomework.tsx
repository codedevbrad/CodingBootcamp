"use client";

import * as React from "react";
import { createHomeworkForStudent } from "../../../db/homework/createHomework/query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";

type Task = { text: string; done?: boolean };

export function CreateHomeworkModal({
  studentId,
  onCreated,
  trigger,
}: {
  studentId: string;
  onCreated?: () => void; // e.g. mutate()
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState(""); // yyyy-mm-dd
  const [tasks, setTasks] = React.useState<Task[]>([{ text: "", done: false }]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setTasks([{ text: "", done: false }]);
    setErrorMsg(null);
  };

  const addTask = () => setTasks((t) => [...t, { text: "", done: false }]);
  const removeTask = (idx: number) =>
    setTasks((t) => (t.length > 1 ? t.filter((_, i) => i !== idx) : [{ text: "", done: false }]));
  const updateTaskText = (idx: number, text: string) =>
    setTasks((t) => t.map((item, i) => (i === idx ? { ...item, text } : item)));
  const toggleTaskDone = (idx: number, checked: boolean) =>
    setTasks((t) => t.map((item, i) => (i === idx ? { ...item, done: checked } : item)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedTitle = title.trim();
    const cleanedTasks = tasks
      .map((t) => ({ text: t.text.trim(), done: !!t.done }))
      .filter((t) => t.text.length > 0);

    if (!trimmedTitle) {
      setErrorMsg("Please provide a title.");
      return;
    }

    setSubmitting(true);
    try {
      await createHomeworkForStudent(studentId, {
        title: trimmedTitle,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        tasks: cleanedTasks,
      });
      resetForm();
      setOpen(false);
      onCreated?.();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to create homework. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || !title.trim();

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Homework
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Homework</DialogTitle>
          <DialogDescription>Give it a title, due date, and a checklist of tasks.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="hw-title">Title</Label>
            <Input
              id="hw-title"
              placeholder="e.g. Async JS Exercises"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hw-desc">Description</Label>
            <Textarea
              id="hw-desc"
              placeholder="Optional notes for the student…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hw-due">Due date</Label>
            <Input
              id="hw-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tasks</Label>
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addTask}>
                <Plus className="h-4 w-4" /> Add task
              </Button>
            </div>

            <div className="space-y-3 max-h-72 overflow-auto pr-1">
              {tasks.map((t, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
                  <Checkbox
                    checked={!!t.done}
                    onCheckedChange={(v) => toggleTaskDone(idx, !!v)}
                  />
                  <Input
                    placeholder={`Task #${idx + 1}`}
                    value={t.text}
                    onChange={(e) => updateTaskText(idx, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(idx)}
                    aria-label="Remove task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={disabled}>
              {submitting ? "Creating…" : "Create Homework"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
