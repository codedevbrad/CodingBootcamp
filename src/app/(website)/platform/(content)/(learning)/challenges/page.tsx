import { getChallengeGroupsUI } from "./db";
import ChallengeGroupsPageClient from "./client";

export default async function Page() {
  const groups = await getChallengeGroupsUI();
  return <ChallengeGroupsPageClient initialGroups={groups} />;
}

