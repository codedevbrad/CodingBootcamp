"use server";

import { getStudentHistory } from "@/app/features/subscription/tutored/connection/tutor/db/db.student-details";
import { notFound } from "next/navigation";
import HistoryClient from "./client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function StudentHistoryPage({
  params,
}: {
  params: { studentId: string };
}) {
  const history = await getStudentHistory(params.studentId);

  if (!history.subscription) {
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

      <HistoryClient
        subscription={history.subscription}
        sessions={history.sessions}
        homework={history.homework}
        tutorRequest={history.tutorRequest}
      />
    </div>
  );
}

