"use server";

import { getTutorProfileId } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-profile";
import { getPendingTutorRequests, getTutorRequests } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-requests";
import TutorRequestsClient from "./client";
import { Prisma } from "@prisma/client";

type TutorRequestWithStudent = Prisma.TutorRequestGetPayload<{
  include: {
    studentProfile: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;

export default async function TutorRequestsPage() {
  let requests: TutorRequestWithStudent[] = [];
  let pendingRequests: TutorRequestWithStudent[] = [];

  try {
    const tutorProfileId = await getTutorProfileId();
    [requests, pendingRequests] = await Promise.all([
      getTutorRequests(tutorProfileId),
      getPendingTutorRequests(tutorProfileId),
    ]);
  } catch (error) {
    console.error("Error fetching tutor requests:", error);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tutor Requests</h1>
        <p className="text-muted-foreground">
          Manage student requests to become your student
        </p>
      </div>

      <TutorRequestsClient
        initialRequests={requests}
        initialPendingRequests={pendingRequests}
      />
    </div>
  );
}

