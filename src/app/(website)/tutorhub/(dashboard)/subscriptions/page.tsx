"use server";

import { getTutorProfileId } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-profile";
import { getTutorSubscriptions } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-requests";
import TutorSubscriptionsClient from "./client";
import { Prisma } from "@prisma/client";

type TutorSubscriptionWithStudent = Prisma.TutorSubscriptionGetPayload<{
  include: {
    student: {
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

export default async function TutorSubscriptionsPage() {
  let subscriptions: TutorSubscriptionWithStudent[] = [];

  try {
    const tutorProfileId = await getTutorProfileId();
    subscriptions = await getTutorSubscriptions(tutorProfileId);
  } catch (error) {
    console.error("Error fetching tutor subscriptions:", error);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Students</h1>
        <p className="text-muted-foreground">
          View and manage your active student subscriptions
        </p>
      </div>

      <TutorSubscriptionsClient initialSubscriptions={subscriptions} />
    </div>
  );
}

