import { getProjectBySlug } from "@/app/features/projects/creator/_domain/db";
import { redirect } from "next/navigation";
import ProjectContentAdmin from "@/app/features/projects/creator/_components/ProjectContentAdmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProjectCreatorPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    redirect("/creator/projects");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/creator/projects">
              <Button variant="ghost" size="sm">
                ← Back to Projects
              </Button>
            </Link>
            <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
          </div>
        </div>
      </div>

      <ProjectContentAdmin
        projectId={project.id}
        initialContent={project.content}
      />
    </div>
  );
}