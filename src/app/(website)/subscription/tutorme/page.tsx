"use server";

import { getAllTutors } from "@/app/features/subscription/tutored/connection/student/db/db.tutor-requests";
import TutorMeClient from "./client";
import { Prisma } from "@prisma/client";

type TutorWithUser = Prisma.TutorProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    tutorSubscriptions: {
      select: {
        id: true;
      };
    };
  };
}>;


export default async function TutorMePage() {
  let tutors: TutorWithUser[] = [];

  try {
    tutors = await getAllTutors();
  } catch (error) {
    console.error("Error fetching tutors:", error);
  }

  return <TutorMeClient initialTutors={tutors} />;
}
