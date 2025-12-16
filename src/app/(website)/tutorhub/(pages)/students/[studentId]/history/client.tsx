"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Clock, UserCheck, CheckCircle2, FileText, UserPlus, ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Prisma } from "@prisma/client";

type Session = Prisma.TutoringSessionGetPayload<{}>;
type Homework = Prisma.HomeworkGetPayload<{}>;
type Subscription = Prisma.TutorSubscriptionGetPayload<{
  include: {
    student: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;
type TutorRequest = Prisma.TutorRequestGetPayload<{}>;

type HistoryEvent = {
  id: string;
  type: "subscription" | "session" | "homework" | "request";
  date: Date;
  title: string;
  description?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  data: Session | Homework | Subscription | TutorRequest;
};

type HistoryClientProps = {
  subscription: Subscription;
  sessions: Session[];
  homework: Homework[];
  tutorRequest: TutorRequest | null;
};

export default function HistoryClient({
  subscription,
  sessions,
  homework,
  tutorRequest,
}: HistoryClientProps) {
  // Create a timeline of all events
  const events: HistoryEvent[] = [];

  // Add subscription start
  const studentName = subscription.student?.user?.name || "student";
  events.push({
    id: `subscription-${subscription.id}`,
    type: "subscription",
    date: new Date(subscription.assignedAt),
    title: "Student Assigned",
    description: `Started working with ${studentName}`,
    icon: <UserCheck className="w-5 h-5" />,
    badge: subscription.endedAt ? (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Ended</Badge>
    ) : (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
    ),
    data: subscription,
  });

  // Add tutor request if exists
  if (tutorRequest) {
    events.push({
      id: `request-${tutorRequest.id}`,
      type: "request",
      date: new Date(tutorRequest.requestAt),
      title: "Tutor Request",
      description: `Status: ${tutorRequest.status}`,
      icon: <UserPlus className="w-5 h-5" />,
      badge: <Badge variant={
        tutorRequest.status === "ACCEPTED" ? "default" :
        tutorRequest.status === "REJECTED" ? "destructive" :
        "outline"
      }>{tutorRequest.status}</Badge>,
      data: tutorRequest,
    });
  }

  // Add all sessions
  sessions.forEach((session) => {
    const isPast = new Date(session.startTime) < new Date();
    events.push({
      id: `session-${session.id}`,
      type: "session",
      date: new Date(session.startTime),
      title: session.title,
      description: session.description || undefined,
      icon: <Calendar className="w-5 h-5" />,
      badge: (
        <div className="flex items-center gap-2">
          <Badge variant={isPast ? "outline" : "default"}>
            {session.length}
          </Badge>
          {isPast && <Badge variant="secondary">Past</Badge>}
        </div>
      ),
      data: session,
    });
  });

  // Add all homework events
  homework.forEach((hw) => {
    // Homework created
    events.push({
      id: `homework-created-${hw.id}`,
      type: "homework",
      date: new Date(hw.createdAt),
      title: `Homework Assigned: ${hw.title}`,
      description: hw.description || undefined,
      icon: <BookOpen className="w-5 h-5" />,
      badge: <Badge variant="outline">{hw.status}</Badge>,
      data: hw,
    });

    // Homework submitted
    if (hw.submittedAt) {
      events.push({
        id: `homework-submitted-${hw.id}`,
        type: "homework",
        date: new Date(hw.submittedAt),
        title: `Homework Submitted: ${hw.title}`,
        description: "Student submitted for review",
        icon: <FileText className="w-5 h-5" />,
        badge: <Badge variant="secondary">SUBMITTED</Badge>,
        data: hw,
      });
    }

    // Homework graded
    if (hw.gradedAt) {
      events.push({
        id: `homework-graded-${hw.id}`,
        type: "homework",
        date: new Date(hw.gradedAt),
        title: `Homework Graded: ${hw.title}`,
        description: hw.grade ? `Grade: ${hw.grade}/100` : "Graded",
        icon: <CheckCircle2 className="w-5 h-5" />,
        badge: <Badge variant="default">COMPLETED</Badge>,
        data: hw,
      });
    }
  });

  // Sort events by date (newest first)
  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  const getEventColor = (type: string) => {
    switch (type) {
      case "subscription":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      case "session":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
      case "homework":
        return "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300";
      case "request":
        return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300";
    }
  };

  const getEventBorderColor = (type: string) => {
    switch (type) {
      case "subscription":
        return "border-green-300 dark:border-green-700";
      case "session":
        return "border-blue-300 dark:border-blue-700";
      case "homework":
        return "border-purple-300 dark:border-purple-700";
      case "request":
        return "border-orange-300 dark:border-orange-700";
      default:
        return "border-gray-300 dark:border-gray-700";
    }
  };

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = format(event.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, HistoryEvent[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Activity History</h2>
        <p className="text-muted-foreground">
          Complete timeline of all interactions and activities
        </p>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No history available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(eventsByDate)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, dayEvents]) => {
              const date = new Date(dateKey);
              const isToday = format(new Date(), "yyyy-MM-dd") === dateKey;
              const isYesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd") === dateKey;

              return (
                <div key={dateKey} className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-border" />
                    <div className="text-sm font-medium text-muted-foreground px-3">
                      {isToday
                        ? "Today"
                        : isYesterday
                        ? "Yesterday"
                        : format(date, "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-3">
                    {dayEvents.map((event) => (
                      <Card
                        key={event.id}
                        className={`border-l-4 ${getEventBorderColor(event.type)}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-lg ${getEventColor(event.type)} flex-shrink-0`}
                            >
                              {event.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="font-medium text-base">{event.title}</div>
                                  {event.description && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {event.description}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {format(event.date, "h:mm a")}
                                    <span className="mx-1">•</span>
                                    {formatDistanceToNow(event.date, { addSuffix: true })}
                                  </div>
                                </div>
                                {event.badge && (
                                  <div className="flex-shrink-0">{event.badge}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Total activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-xl font-bold">{sessions.length}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <BookOpen className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-xl font-bold">{homework.length}</div>
              <div className="text-xs text-muted-foreground">Homework</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-xl font-bold">
                {homework.filter((hw) => hw.status === "COMPLETED").length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-xl font-bold">
                {formatDistanceToNow(new Date(subscription.assignedAt), { addSuffix: false }).split(" ")[0]}
              </div>
              <div className="text-xs text-muted-foreground">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

