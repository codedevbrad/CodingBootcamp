"use server";

import { getStudentSubscription } from "@/app/features/subscription/tutored/connection/tutor/db/db.student-details";
import { notFound } from "next/navigation";
import SessionForm from "../_components/SessionForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateSessionPage({
  params,
}: {
  params: { studentId: string };
}) {
  const subscription = await getStudentSubscription(params.studentId);

  if (!subscription) {
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
        <h1 className="text-3xl font-bold mb-2">Schedule New Session</h1>
        <p className="text-muted-foreground">
          Create a new tutoring session for {subscription.student.user.name}
        </p>
      </div>

      <SessionForm studentId={params.studentId} mode="create" />
    </div>
  );
}

