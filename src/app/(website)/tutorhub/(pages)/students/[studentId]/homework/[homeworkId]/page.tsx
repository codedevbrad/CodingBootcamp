"use server";

import { getHomeworkById, getStudentSubscription } from "@/app/features/subscription/tutored/connection/tutor/db/db.student-details";
import { notFound } from "next/navigation";
import HomeworkDetailClient from "./client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomeworkDetailPage({
  params,
}: {
  params: { studentId: string; homeworkId: string };
}) {
  const subscription = await getStudentSubscription(params.studentId);
  const homework = await getHomeworkById(params.homeworkId, params.studentId);

  if (!subscription || !homework) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href={`/tutorhub/students/${params.studentId}/homework`}>
          <Button variant="ghost" className="mb-4">
            ← Back to Homework
          </Button>
        </Link>
      </div>

      <HomeworkDetailClient
        homework={homework}
        studentName={subscription.student.user.name || "Student"}
      />
    </div>
  );
}

