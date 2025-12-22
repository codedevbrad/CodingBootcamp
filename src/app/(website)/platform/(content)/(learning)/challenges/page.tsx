import { getChallengeGroupsUI } from "../../../../../features/challenges/student/domains/studentChallenges";
import ChallengeGroupsPageClient from "./client";

export default async function Page() {
  const groups = await getChallengeGroupsUI();
  return <ChallengeGroupsPageClient initialGroups={groups} />;
}

