"use server";

import { getAllTutorInvitations } from "../../../../features/portals/adminhub/domains/db.tutor-invitations/db.tutor-invitations";
import { getUserId } from "@/app/auth/session/auth.server.getUser";
import TutorInvitationsClient from "./client";

export default async function TutorInvitationsPage() {
  const invitations = await getAllTutorInvitations();
  const userId = await getUserId().catch(() => null);

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold">Tutor Invitations</h1>
      <p className="text-sm text-gray-500">
        Create and manage tutor signup invitations.
      </p>
      <div className="flex flex-col gap-4 mt-4">
        <TutorInvitationsClient initialInvitations={invitations} currentUserId={userId} />
      </div>
    </div>
  );
}

