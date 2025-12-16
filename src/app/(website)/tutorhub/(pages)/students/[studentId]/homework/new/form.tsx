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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Plus, X, BookOpen, Code, Target, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createHomework } from "@/app/features/subscription/tutored/connection/tutor/db/db.homework";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Task = {
  type: "topic" | "project" | "challenge" | "custom";
  id?: string;
  title?: string;
  content?: string;
};

type CreateHomeworkFormProps = {
  studentId: string;
  topics: Array<{ id: string; slug: string; title: string; description: string | null }>;
  projects: Array<{ id: string; slug: string; title: string; description: string | null }>;
  challenges: Array<{ id: string; slug: string; title: string; description: string | null }>;
};

export default function CreateHomeworkForm({
  studentId,
  topics,
  projects,
  challenges,
}: CreateHomeworkFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTask = (type: "topic" | "project" | "challenge" | "custom") => {
    setTasks([...tasks, { type, id: undefined, title: undefined, content: undefined }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, updates: Partial<Task>) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], ...updates };
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (tasks.length === 0) {
      toast.error("At least one task is required");
      return;
    }

    // Validate tasks
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.type === "custom") {
        if (!task.content?.trim()) {
          toast.error(`Task ${i + 1}: Custom task content is required`);
          return;
        }
      } else {
        if (!task.id) {
          toast.error(`Task ${i + 1}: Please select a ${task.type}`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      await createHomework(studentId, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate,
        tasks: tasks.map((task) => {
          if (task.type === "custom") {
            return {
              type: "custom",
              content: task.content,
            };
          } else {
            return {
              type: task.type,
              id: task.id!,
            };
          }
        }),
      });

      toast.success("Homework assigned successfully!");
      router.push(`/tutorhub/students/${studentId}/homework`);
    } catch (error) {
      console.error("Error creating homework:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create homework");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "topic":
        return <BookOpen className="w-4 h-4" />;
      case "project":
        return <Code className="w-4 h-4" />;
      case "challenge":
        return <Target className="w-4 h-4" />;
      case "custom":
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "topic":
        return "Topic";
      case "project":
        return "Project";
      case "challenge":
        return "Challenge";
      case "custom":
        return "Custom Task";
      default:
        return type;
    }
  };

  const getOptionsForTaskType = (type: string) => {
    switch (type) {
      case "topic":
        return topics;
      case "project":
        return projects;
      case "challenge":
        return challenges;
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homework Details</CardTitle>
        <CardDescription>
          Fill in the details and add tasks for this homework assignment
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
              placeholder="e.g., Week 1 Assignment"
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
              placeholder="Optional description for the homework assignment"
              rows={3}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tasks *</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTask("topic")}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Topic
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTask("project")}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTask("challenge")}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Challenge
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTask("custom")}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Custom
                </Button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No tasks added yet. Click the buttons above to add tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTaskTypeIcon(task.type)}
                        <span className="font-medium">
                          {getTaskTypeLabel(task.type)} {index + 1}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {task.type === "custom" ? (
                      <div className="space-y-2">
                        <Label>Task Content *</Label>
                        <Textarea
                          value={task.content || ""}
                          onChange={(e) =>
                            updateTask(index, { content: e.target.value })
                          }
                          placeholder="Enter the custom task instructions..."
                          rows={4}
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>
                          Select {getTaskTypeLabel(task.type)} *
                        </Label>
                        <Select
                          value={task.id || ""}
                          onValueChange={(value) =>
                            updateTask(index, { id: value })
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Choose a ${getTaskTypeLabel(task.type)}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {getOptionsForTaskType(task.type).map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                <div>
                                  <div className="font-medium">{option.title}</div>
                                  {option.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {option.description.substring(0, 60)}
                                      {option.description.length > 60 ? "..." : ""}
                                    </div>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tutorhub/students/${studentId}/homework`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Assign Homework"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

