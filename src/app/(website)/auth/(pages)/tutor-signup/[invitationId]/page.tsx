import { getTutorInvitation } from "@/app/features/portals/adminhub/domains/db.tutor-invitations/db.tutor-invitations";
import TutorSignupClient from "./client";

export default async function TutorSignupPage({
  params,
}: {
  params: { invitationId: string };
}) {
  const invitation = await getTutorInvitation(params.invitationId);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Invalid Invitation</h1>
          <p className="text-gray-500">
            This invitation link is not valid. Please contact the administrator
            for a new invitation.
          </p>
        </div>
      </div>
    );
  }

  if (invitation.used) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Invitation Already Used</h1>
          <p className="text-gray-500">
            This invitation has already been used. If you need tutor access,
            please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Invitation Expired</h1>
          <p className="text-gray-500">
            This invitation has expired. Please contact the administrator for a
            new invitation.
          </p>
        </div>
      </div>
    );
  }

  return <TutorSignupClient invitation={invitation} />;
}

