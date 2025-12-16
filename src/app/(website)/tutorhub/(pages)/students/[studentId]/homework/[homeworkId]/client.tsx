"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, CheckCircle2, Clock, FileText, Target, Code } from "lucide-react";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";

type Homework = Prisma.HomeworkGetPayload<Record<string, never>>;

type Task = {
  type: "topic" | "project" | "challenge" | "custom";
  id?: string;
  content?: string;
};

type HomeworkDetailClientProps = {
  homework: Homework;
  studentName: string;
};

export default function HomeworkDetailClient({
  homework,
  studentName,
}: HomeworkDetailClientProps) {
  const tasks = (homework.tasks as Task[]) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "SUBMITTED":
        return "secondary";
      case "IN_PROGRESS":
        return "outline";
      case "RETURNED":
        return "outline";
      case "ASSIGNED":
        return "outline";
      case "DRAFT":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "topic":
        return <BookOpen className="w-5 h-5" />;
      case "project":
        return <Code className="w-5 h-5" />;
      case "challenge":
        return <Target className="w-5 h-5" />;
      case "custom":
        return <FileText className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
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

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "topic":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
      case "project":
        return "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300";
      case "challenge":
        return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300";
      case "custom":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{homework.title}</CardTitle>
              {homework.description && (
                <CardDescription className="text-base mt-2">
                  {homework.description}
                </CardDescription>
              )}
            </div>
            <Badge variant={getStatusBadgeVariant(homework.status)} className="ml-4">
              {homework.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Assigned</div>
              <div className="font-medium">
                {format(new Date(homework.createdAt), "MMM d, yyyy")}
              </div>
            </div>
            {homework.dueDate && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </div>
                <div className="font-medium">
                  {format(new Date(homework.dueDate), "MMM d, yyyy")}
                </div>
              </div>
            )}
            {homework.submittedAt && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Submitted</div>
                <div className="font-medium">
                  {format(new Date(homework.submittedAt), "MMM d, yyyy")}
                </div>
              </div>
            )}
            {homework.gradedAt && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Graded</div>
                <div className="font-medium">
                  {format(new Date(homework.gradedAt), "MMM d, yyyy")}
                </div>
              </div>
            )}
          </div>
          {homework.grade && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Grade</div>
              <div className="text-2xl font-bold">{homework.grade.toString()}/100</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Tasks ({tasks.length})
          </CardTitle>
          <CardDescription>Assigned tasks for this homework</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tasks assigned</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getTaskTypeColor(task.type)}`}>
                      {getTaskTypeIcon(task.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {getTaskTypeLabel(task.type)} {index + 1}
                      </div>
                    </div>
                  </div>
                  {task.type === "custom" && task.content && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-1">Task Instructions:</div>
                      <div className="text-sm whitespace-pre-wrap">{task.content}</div>
                    </div>
                  )}
                  {task.type !== "custom" && task.id && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      ID: {task.id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Card */}
      {homework.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm whitespace-pre-wrap">{homework.feedback}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata Card (if exists) */}
      {homework.metadata && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(homework.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

