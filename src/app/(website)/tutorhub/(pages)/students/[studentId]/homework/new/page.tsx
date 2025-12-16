"use server";

import { getTopicsForHomework, getProjectsForHomework, getChallengesForHomework } from "@/app/features/subscription/tutored/connection/tutor/db/db.homework";
import { getStudentSubscription } from "@/app/features/subscription/tutored/connection/tutor/db/db.student-details";
import { notFound } from "next/navigation";
import CreateHomeworkForm from "./form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateHomeworkPage({
  params,
}: {
  params: { studentId: string };
}) {
  const subscription = await getStudentSubscription(params.studentId);
  const topics = await getTopicsForHomework();
  const projects = await getProjectsForHomework();
  const challenges = await getChallengesForHomework();

  if (!subscription) {
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assign New Homework</h1>
        <p className="text-muted-foreground">
          Create a new homework assignment with tasks for {subscription.student.user.name}
        </p>
      </div>

      <CreateHomeworkForm
        studentId={params.studentId}
        topics={topics}
        projects={projects}
        challenges={challenges}
      />
    </div>
  );
}

