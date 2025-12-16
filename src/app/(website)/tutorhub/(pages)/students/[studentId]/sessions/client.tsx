"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Edit } from "lucide-react";
import { format } from "date-fns";
import { Prisma, SessionLength, TutoringSessionStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Session = Prisma.TutoringSessionGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

type SessionsClientProps = {
  studentId: string;
  studentName: string;
  initialSessions: Session[];
};

export default function SessionsClient({
  studentId,
  initialSessions,
}: SessionsClientProps) {
  const router = useRouter();
  const getSessionLengthLabel = (length: SessionLength) => {
    switch (length) {
      case SessionLength.MAX60:
        return "60 min";
      case SessionLength.MAX90:
        return "90 min";
      case SessionLength.MAX120:
        return "120 min";
      default:
        return length;
    }
  };

  const getStatusLabel = (status: TutoringSessionStatus) => {
    switch (status) {
      case TutoringSessionStatus.PENDING:
        return "Pending";
      case TutoringSessionStatus.COMPLETED:
        return "Completed";
      case TutoringSessionStatus.CANCELLED:
        return "Cancelled";
      case TutoringSessionStatus.RESCHEDULED:
        return "Rescheduled";
      case TutoringSessionStatus.POSTPONED:
        return "Postponed";
      case TutoringSessionStatus.MISSED:
        return "Missed";
      case TutoringSessionStatus.NO_SHOW:
        return "No Show";
      case TutoringSessionStatus.NO_SHOW_NO_REASON:
        return "No Show (No Reason)";
      case TutoringSessionStatus.NO_SHOW_WITH_REASON:
        return "No Show (With Reason)";
      case TutoringSessionStatus.NO_SHOW_WITH_REASON_AND_RESCHEDULED:
        return "No Show (Rescheduled)";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: TutoringSessionStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case TutoringSessionStatus.COMPLETED:
        return "default";
      case TutoringSessionStatus.PENDING:
        return "secondary";
      case TutoringSessionStatus.CANCELLED:
      case TutoringSessionStatus.MISSED:
      case TutoringSessionStatus.NO_SHOW:
      case TutoringSessionStatus.NO_SHOW_NO_REASON:
      case TutoringSessionStatus.NO_SHOW_WITH_REASON:
        return "destructive";
      default:
        return "outline";
    }
  };

  const upcomingSessions = initialSessions.filter(
    (session) => new Date(session.startTime) > new Date()
  );
  const pastSessions = initialSessions.filter(
    (session) => new Date(session.startTime) <= new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">All Sessions</h2>
          <p className="text-muted-foreground">
            Total: {initialSessions.length} sessions
          </p>
        </div>
        <Button onClick={() => router.push(`/tutorhub/students/${studentId}/sessions/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Session
        </Button>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Sessions ({upcomingSessions.length})
            </CardTitle>
            <CardDescription>Scheduled future sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{session.title}</div>
                      {session.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {session.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(session.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      {session.categories && session.categories.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {session.categories.map((sessionCategory) => (
                            <Badge key={sessionCategory.categoryId} variant="outline" className="text-xs">
                              {sessionCategory.category.title}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(session.status)}>
                      {getStatusLabel(session.status)}
                    </Badge>
                    <Badge variant="outline">
                      {getSessionLengthLabel(session.length)}
                    </Badge>
                    <Link href={`/tutorhub/students/${studentId}/sessions/${session.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Past Sessions ({pastSessions.length})
            </CardTitle>
            <CardDescription>Completed sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors opacity-75"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{session.title}</div>
                      {session.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {session.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(session.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      {session.categories && session.categories.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {session.categories.map((sessionCategory) => (
                            <Badge key={sessionCategory.categoryId} variant="outline" className="text-xs">
                              {sessionCategory.category.title}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(session.status)}>
                      {getStatusLabel(session.status)}
                    </Badge>
                    <Badge variant="outline">
                      {getSessionLengthLabel(session.length)}
                    </Badge>
                    <Link href={`/tutorhub/students/${studentId}/sessions/${session.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {initialSessions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No sessions scheduled yet</p>
            <Button className="mt-4" onClick={() => router.push(`/tutorhub/students/${studentId}/sessions/new`)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule First Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

