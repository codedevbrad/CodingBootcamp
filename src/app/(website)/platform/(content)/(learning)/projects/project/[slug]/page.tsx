import { getProjectBySlug } from "@/app/features/projects/student/domain/db";
import { notFound } from "next/navigation";
import ProjectView from "@/app/features/projects/student/components/ProjectView";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Kanban from "../../../../../../../../components/systems/kanban";

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/platform/projects">
              <Button variant="ghost" size="sm">
                ← Back to Projects
              </Button>
            </Link>
            <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
          </div>
        </div>
      </div>

      <ProjectView project={project} />
      <Kanban />
    </div>
  );
}

