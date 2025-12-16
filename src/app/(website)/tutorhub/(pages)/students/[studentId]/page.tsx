"use server";

import { getStudentSubscription } from "@/app/features/subscription/tutored/connection/tutor/db/db.student-details";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, User, Mail, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function StudentDetailPage({
  params,
}: {
  params: { studentId: string };
}) {
  const subscription = await getStudentSubscription(params.studentId);

  if (!subscription) {
    notFound();
  }

  const student = subscription.student.user;
  const initials = student.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/tutorhub/students">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </Link>
      </div>

      {/* Student Header Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={student.image || undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{student.name || "Unknown"}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {student.email}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active Student
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{subscription._count.sessions}</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{subscription._count.homework}</div>
              <div className="text-sm text-muted-foreground">Homework Assignments</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{subscription.student.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <User className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                Since {format(new Date(subscription.assignedAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Sessions, Homework, and History */}
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">
            Sessions ({subscription._count.sessions})
          </TabsTrigger>
          <TabsTrigger value="homework">
            Homework ({subscription._count.homework})
          </TabsTrigger>
          <TabsTrigger value="history">
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tutoring Sessions</CardTitle>
                  <CardDescription>All scheduled and past sessions</CardDescription>
                </div>
                <Link href={`/tutorhub/students/${params.studentId}/sessions`}>
                  <Button variant="outline">Manage Sessions</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {subscription.sessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No sessions scheduled yet</p>
              ) : (
                <div className="space-y-3">
                  {subscription.sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{session.title}</div>
                          {session.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {session.description}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground mt-1">
                            {format(new Date(session.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{session.length}</Badge>
                    </div>
                  ))}
                  {subscription.sessions.length > 5 && (
                    <div className="text-center pt-2">
                      <Link href={`/tutorhub/students/${params.studentId}/sessions`}>
                        <Button variant="ghost">
                          View All {subscription.sessions.length} Sessions
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="homework" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Homework Assignments</CardTitle>
                  <CardDescription>All assigned homework</CardDescription>
                </div>
                <Link href={`/tutorhub/students/${params.studentId}/homework`}>
                  <Button variant="outline">Manage Homework</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {subscription.homework.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No homework assigned yet</p>
              ) : (
                <div className="space-y-3">
                  {subscription.homework.slice(0, 5).map((hw) => (
                    <div key={hw.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{hw.title}</div>
                          {hw.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {hw.description}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground mt-1">
                            {hw.dueDate 
                              ? `Due ${format(new Date(hw.dueDate), "MMM d, yyyy")}`
                              : "No due date"
                            }
                            {hw.grade && (
                              <span className="ml-4">Grade: {hw.grade}/100</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        hw.status === "COMPLETED" ? "default" :
                        hw.status === "SUBMITTED" ? "secondary" :
                        hw.status === "IN_PROGRESS" ? "outline" :
                        "outline"
                      }>
                        {hw.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                  {subscription.homework.length > 5 && (
                    <div className="text-center pt-2">
                      <Link href={`/tutorhub/students/${params.studentId}/homework`}>
                        <Button variant="ghost">
                          View All {subscription.homework.length} Assignments
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>Complete timeline of all interactions</CardDescription>
                </div>
                <Link href={`/tutorhub/students/${params.studentId}/history`}>
                  <Button variant="outline">View Full History</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  View the complete activity timeline
                </p>
                <Link href={`/tutorhub/students/${params.studentId}/history`}>
                  <Button>Open History Page</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

