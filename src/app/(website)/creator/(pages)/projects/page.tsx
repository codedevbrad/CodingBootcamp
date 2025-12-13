import ProjectsListClient from "@/app/features/projects/creator/_components/ProjectsListClient";
import { getDifficulties } from "@/app/features/projects/creator/_domain/db";
import CartoonCard from "@/components/custom/cartoonCard";

export default async function Page() {
  const difficulties = await getDifficulties();

  return (
    <div className="w-full p-5">
      <CartoonCard label="Projects" title="Projects">
        <p>
          Projects are a way to learn how to code by building something. 
          Create and manage projects for students to work on.
        </p>
      </CartoonCard>
      <ProjectsListClient initialDifficulties={difficulties} />
    </div>
  );
}
