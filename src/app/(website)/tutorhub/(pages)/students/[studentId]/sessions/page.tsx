"use server";

import { getStudentSessions, getStudentSubscription } from "@/app/features/subscription/tutored/connection/tutor/db/db.student-details";
import { notFound } from "next/navigation";
import SessionsClient from "./client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentSessionsPage({
  params,
}: {
  params: { studentId: string };
}) {
  const subscription = await getStudentSubscription(params.studentId);
  const sessions = await getStudentSessions(params.studentId);

  if (!subscription) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/tutorhub/students/${params.studentId}`}>
          <Button variant="ghost" className="mb-4">
            ← Back to Student
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Sessions</h1>
        <p className="text-muted-foreground">
          View and manage tutoring sessions for {subscription.student.user.name}
        </p>
      </div>

      <SessionsClient 
        studentId={params.studentId}
        studentName={subscription.student.user.name || "Student"}
        initialSessions={sessions}
      />
    </div>
  );
}

