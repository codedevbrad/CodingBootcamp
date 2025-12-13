// src/app/(creator)/challenges/page.tsx

import { getChallengeGroupsWithRelations  } from "../../../../features/challenges/creator/domains/db";
import ChallengeGroupAdmin from "./(groupcomponents)/client";
import CartoonCard from "@/components/custom/cartoonCard";

export default async function Page() {
  const groups = await getChallengeGroupsWithRelations();

  return <>
    <CartoonCard label="Challenges" title="What are challenges?">
        <p> Manage and explore various challenge groups to enhance your skills and track progress. </p>
    </CartoonCard>
    <ChallengeGroupAdmin groups={groups} />;
  </>
}
