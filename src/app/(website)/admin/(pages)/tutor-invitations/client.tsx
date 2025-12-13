"use client";

import { useState, useTransition } from "react";
import { createTutorInvitation, deleteTutorInvitation } from "../../../../features/portals/adminhub/domains/db.tutor-invitations/db.tutor-invitations";

type TutorInvitation = {
  id: string;
  email: string;
  invitationId: string;
  used: boolean;
  usedAt: Date | null;
  usedBy: string | null;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date | null;
};

export default function TutorInvitationsClient({
  initialInvitations,
  currentUserId,
}: {
  initialInvitations: TutorInvitation[];
  currentUserId: string | null;
}) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [email, setEmail] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [isPending, startTransition] = useTransition();

  async function handleCreateInvitation() {
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    if (!currentUserId) {
      alert("You must be logged in as admin");
      return;
    }

    startTransition(async () => {
      try {

        const invitation = await createTutorInvitation(
          email,
          currentUserId,
          expiresInDays
        );

        const signupUrl = `${window.location.origin}/auth/tutor-signup/${invitation.invitationId}`;

        setInvitations((prev) => [invitation, ...prev]);
        setEmail("");

        // Show the invitation link
        alert(`Invitation created! Share this link:\n${signupUrl}`);
      } catch (error) {
        console.error("Failed to create invitation:", error);
        alert("Failed to create invitation");
      }
    });
  }

  async function handleDeleteInvitation(invitationId: string) {
    if (!confirm("Are you sure you want to delete this invitation?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteTutorInvitation(invitationId);
        setInvitations((prev) =>
          prev.filter((inv) => inv.invitationId !== invitationId)
        );
      } catch (error) {
        console.error("Failed to delete invitation:", error);
        alert("Failed to delete invitation");
      }
    });
  }

  function getStatusBadge(invitation: TutorInvitation) {
    if (invitation.used) {
      return (
        <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          Used
        </span>
      );
    }
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return (
        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Expired
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        Active
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">Create New Invitation</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tutor@example.com"
            className="px-4 py-2 border rounded flex-1 min-w-[200px]"
            disabled={isPending}
          />
          <input
            type="number"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value))}
            placeholder="Days"
            min="1"
            max="365"
            className="px-4 py-2 border rounded w-24"
            disabled={isPending}
          />
          <button
            onClick={handleCreateInvitation}
            disabled={isPending || !email}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
          >
            {isPending ? "Creating..." : "Create Invitation"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Invitation will expire in {expiresInDays} days (leave empty for no expiration)
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">All Invitations</h2>
        {invitations.length === 0 ? (
          <p className="text-gray-500">No invitations created yet.</p>
        ) : (
          <div className="space-y-2">
            {invitations.map((inv) => {
              const signupUrl = `${window.location.origin}/auth/tutor-signup/${inv.invitationId}`;
              return (
                <div
                  key={inv.id}
                  className="p-4 border rounded flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{inv.email}</p>
                      {getStatusBadge(inv)}
                    </div>
                    <p className="text-sm text-gray-500">
                      ID: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{inv.invitationId}</code>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(inv.createdAt).toLocaleDateString()}
                      {inv.expiresAt && (
                        <> • Expires: {new Date(inv.expiresAt).toLocaleDateString()}</>
                      )}
                      {inv.used && inv.usedAt && (
                        <> • Used: {new Date(inv.usedAt).toLocaleDateString()}</>
                      )}
                    </p>
                    {!inv.used && (
                      <div className="mt-2">
                        <a
                          href={signupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {signupUrl}
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(signupUrl);
                            alert("Link copied to clipboard!");
                          }}
                          className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                  {!inv.used && (
                    <button
                      onClick={() => handleDeleteInvitation(inv.invitationId)}
                      disabled={isPending}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

