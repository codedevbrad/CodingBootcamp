// src/app/(creator)/challenges/group/[id]/page.tsx

import { prisma } from "@/lib/db/prisma";
import ChallengesInGroupClient from "./client";

import { getChallengeGroupById , getSubGroupsForGroup } from "../../../db";
import SubGroupListClient from "../(subgroup)/client";

export default async function ChallengeGroupPage({ params }) {

  if ( !params.slug ) {
    return <div className="p-10 text-center">Group not found</div>;
  }


  const group = await getChallengeGroupById({ id: params.slug });
  const subgroups = await getSubGroupsForGroup(params.slug);

  if (!group) {
    return <div className="p-10 text-center">Group not found</div>;
  }

  const categories = await prisma.category.findMany();
  const difficulties = await prisma.difficulty.findMany({
    orderBy: { order: "asc" }
  });
  const languages = await prisma.language.findMany();

  return (
    <>
      <SubGroupListClient
        groupId={params.slug}
        initialSubGroups={subgroups}
      />
      <ChallengesInGroupClient
        group={group}
        challenges={group.challenges}
        categories={categories}
        difficulties={difficulties}
        languages={languages}
        subgroups={subgroups}    
      />
    </>
  );
}
