"use server";

import { getSessionById } from "@/app/features/subscription/tutored/connection/tutor/db/db.sessions";
import { getStudentSubscription } from "@/app/features/subscription/tutored/connection/tutor/db/db.student-details";
import { notFound } from "next/navigation";
import SessionViewClient from "./client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SessionViewPage({
  params,
}: {
  params: { studentId: string; sessionId: string };
}) {
  const subscription = await getStudentSubscription(params.studentId);
  const session = await getSessionById(params.sessionId, params.studentId);

  if (!subscription || !session) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href={`/tutorhub/students/${params.studentId}/sessions`}>
          <Button variant="ghost" className="mb-4">
            ← Back to Sessions
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Session Details</h1>
        <p className="text-muted-foreground">
          View session information for {subscription.student.user.name}
        </p>
      </div>

      <SessionViewClient
        studentId={params.studentId}
        session={session}
      />
    </div>
  );
}

