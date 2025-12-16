"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Plus, CheckCircle2, Clock, FileText, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

type Homework = Prisma.HomeworkGetPayload<Record<string, never>>;

type HomeworkClientProps = {
  studentId: string;
  studentName: string;
  initialHomework: Homework[];
};

export default function HomeworkClient({
  studentId,
  initialHomework,
}: HomeworkClientProps) {
  const router = useRouter();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "SUBMITTED":
        return <FileText className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const activeHomework = initialHomework.filter(
    (hw) => !["COMPLETED", "CANCELLED"].includes(hw.status)
  );
  const completedHomework = initialHomework.filter(
    (hw) => hw.status === "COMPLETED"
  );
  const submittedHomework = initialHomework.filter(
    (hw) => hw.status === "SUBMITTED"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">All Homework</h2>
          <p className="text-muted-foreground">
            Total: {initialHomework.length} assignments
          </p>
        </div>
        <Button onClick={() => router.push(`/tutorhub/students/${studentId}/homework/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Assign New Homework
        </Button>
      </div>

      {/* Active Homework */}
      {activeHomework.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Active Assignments ({activeHomework.length})
            </CardTitle>
            <CardDescription>Currently assigned homework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {getStatusIcon(hw.status)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{hw.title}</div>
                      {hw.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {hw.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {hw.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due {format(new Date(hw.dueDate), "MMM d, yyyy")}
                          </div>
                        )}
                        {hw.grade && (
                          <div className="text-sm font-medium">
                            Grade: {hw.grade.toString()}/100
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(hw.status)}>
                      {hw.status.replace("_", " ")}
                    </Badge>
                    <Link href={`/tutorhub/students/${studentId}/homework/${hw.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submitted Homework */}
      {submittedHomework.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Submitted ({submittedHomework.length})
            </CardTitle>
            <CardDescription>Awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submittedHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      {getStatusIcon(hw.status)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{hw.title}</div>
                      {hw.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {hw.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {hw.submittedAt && (
                          <div>
                            Submitted {format(new Date(hw.submittedAt), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(hw.status)}>
                      {hw.status.replace("_", " ")}
                    </Badge>
                    <Link href={`/tutorhub/students/${studentId}/homework/${hw.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Homework */}
      {completedHomework.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Completed ({completedHomework.length})
            </CardTitle>
            <CardDescription>Finished assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors opacity-75"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      {getStatusIcon(hw.status)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{hw.title}</div>
                      {hw.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {hw.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {hw.gradedAt && (
                          <div>
                            Graded {format(new Date(hw.gradedAt), "MMM d, yyyy")}
                          </div>
                        )}
                        {hw.grade && (
                          <div className="text-sm font-medium">
                            Grade: {hw.grade.toString()}/100
                          </div>
                        )}
                      </div>
                      {hw.feedback && (
                        <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                          Feedback: {hw.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(hw.status)}>
                      {hw.status.replace("_", " ")}
                    </Badge>
                    <Link href={`/tutorhub/students/${studentId}/homework/${hw.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {initialHomework.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No homework assigned yet</p>
            <Button className="mt-4" onClick={() => router.push(`/tutorhub/students/${studentId}/homework/new`)}>
              <Plus className="w-4 h-4 mr-2" />
              Assign First Homework
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

