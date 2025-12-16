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
import { CalendarIcon, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createSession, updateSession } from "@/app/features/subscription/tutored/connection/tutor/db/db.sessions";
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

type SessionFormProps = {
  studentId: string;
  mode: "create" | "edit";
  sessionId?: string;
  initialSession?: Session;
};

type Step = 1 | 2 | 3;

const STEPS: { number: Step; title: string; description: string }[] = [
  { number: 1, title: "Basic Info", description: "Title and description" },
  { number: 2, title: "Schedule", description: "Date, time, and categories" },
  { number: 3, title: "Preparation", description: "Questions and prep items" },
];

export default function SessionForm({
  studentId,
  mode,
  sessionId,
  initialSession,
}: SessionFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");
  const [length, setLength] = useState<SessionLength>(SessionLength.MAX60);
  const [status, setStatus] = useState<TutoringSessionStatus>(TutoringSessionStatus.PENDING);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [prep, setPrep] = useState<string[]>([]);
  const [preSessionNotes, setPreSessionNotes] = useState("");
  const [postSessionContent, setPostSessionContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialSession) {
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

      if (initialSession.preSessionNotes && typeof initialSession.preSessionNotes === 'object') {
        const notes = initialSession.preSessionNotes as any;
        if (Array.isArray(notes.questions)) {
          setQuestions(notes.questions);
        }
        if (Array.isArray(notes.prep)) {
          setPrep(notes.prep);
        }
        if (notes.content) {
          setPreSessionNotes(notes.content);
        }
      }

      if (initialSession.postSessionContent && typeof initialSession.postSessionContent === 'object' && 'content' in initialSession.postSessionContent) {
        setPostSessionContent((initialSession.postSessionContent as { content: string }).content || "");
      }
    }
  }, [mode, initialSession]);

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        if (!title.trim()) {
          toast.error("Title is required");
          return false;
        }
        return true;
      case 2:
        if (!startTime) {
          toast.error("Start time is required");
          return false;
        }
        const combinedDateTime = new Date(startTime);
        combinedDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        if (mode === "create" && combinedDateTime < new Date()) {
          toast.error("Start time must be in the future");
          return false;
        }
        return true;
      case 3:
        return true; // Preparation step is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep((currentStep + 1) as Step);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

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

    if (mode === "create" && combinedDateTime < new Date()) {
      toast.error("Start time must be in the future");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build preSessionNotes object
      const preSessionNotesData: {
        questions?: string[];
        prep?: string[];
        content?: string;
      } = {};
      
      if (questions.length > 0) {
        preSessionNotesData.questions = questions.filter(q => q.trim()).map(q => q.trim());
      }
      
      if (prep.length > 0) {
        preSessionNotesData.prep = prep.filter(p => p.trim()).map(p => p.trim());
      }
      
      if (preSessionNotes.trim()) {
        preSessionNotesData.content = preSessionNotes.trim();
      }

      if (mode === "create") {
        await createSession(studentId, {
          title: title.trim(),
          description: description.trim() || undefined,
          startTime: combinedDateTime,
          length: length,
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
          preSessionNotes: Object.keys(preSessionNotesData).length > 0 ? preSessionNotesData : undefined,
        });
        toast.success("Session scheduled successfully!");
      } else {
        if (!sessionId) {
          throw new Error("Session ID is required for edit mode");
        }
        await updateSession(sessionId, studentId, {
          title: title.trim(),
          description: description.trim() || undefined,
          startTime: combinedDateTime,
          length: length,
          status: status,
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
          preSessionNotes: Object.keys(preSessionNotesData).length > 0 ? preSessionNotesData : undefined,
          postSessionContent: postSessionContent.trim() ? { content: postSessionContent.trim() } : undefined,
        });
        toast.success("Session updated successfully!");
      }

      router.push(`/tutorhub/students/${studentId}/sessions`);
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} session:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${mode === "create" ? "create" : "update"} session`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for the session"
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
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
                    disabled={mode === "create" ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0)) : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>

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

            <div className="space-y-2">
              <CategoryMultiSelect
                selected={categoryIds}
                onChange={setCategoryIds}
              />
            </div>

            {mode === "edit" && (
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
            )}

            {mode === "edit" && (
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
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Questions to Ask</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestions([...questions, ""])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question
                </Button>
              </div>
              {questions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No questions added yet</p>
              ) : (
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={question}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[index] = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder="Enter a question to ask during the session"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Prep Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPrep([...prep, ""])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Prep Item
                </Button>
              </div>
              {prep.length === 0 ? (
                <p className="text-sm text-muted-foreground">No prep items added yet</p>
              ) : (
                <div className="space-y-2">
                  {prep.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const updated = [...prep];
                          updated[index] = e.target.value;
                          setPrep(updated);
                        }}
                        placeholder="Enter something to prepare for the lesson"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPrep(prep.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preSessionNotes">Additional Notes</Label>
              <Textarea
                id="preSessionNotes"
                value={preSessionNotes}
                onChange={(e) => setPreSessionNotes(e.target.value)}
                placeholder="Optional additional notes or agenda for the session"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Schedule New Session" : "Edit Session"}
        </CardTitle>
        <CardDescription>
          {mode === "create" 
            ? "Fill in the details to schedule a new tutoring session"
            : "Update the session information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                      currentStep === step.number
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step.number
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.number ? (
                      <span className="text-lg">✓</span>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-sm font-medium",
                      currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-1 flex-1 mx-2 transition-colors",
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-6 mt-6 border-t">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tutorhub/students/${studentId}/sessions`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
          <div className="flex gap-2">
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? mode === "create"
                    ? "Scheduling..."
                    : "Updating..."
                  : mode === "create"
                  ? "Schedule Session"
                  : "Update Session"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

