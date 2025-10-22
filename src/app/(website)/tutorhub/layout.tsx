// src/app/tutorHub/layout.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import TutorHubHeader from "./(layout)/header/header";
import TutorHydrator from "./db/tutor/hydrate.tutor";
import { unstable_noStore as noStore } from "next/cache";
import NextSessionBanner from "./db/sessions/session/get/ui.sessionBanner";

export const metadata: Metadata = {
  title: "TutorHub - The Code Bootcamp",
  description: "Tutor Dashboard - Learning Application",
};

export const dynamic = "force-dynamic";

export default async function TutorHubLayout({ children }: { children: React.ReactNode }) {
  noStore();

  const session = await auth();               // should exist thanks to middleware
  // role is already enforced by middleware; no redirect needed here

  const me = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: {
      tutorProfile: true,
      accounts: { select: { provider: true, providerAccountId: true } },
    },
  });

  // Handle rare edge: user passed middleware but profile missing
  if (!me?.tutorProfile) {
    // Render a friendly "finish setup" screen, not another redirect loop
    return (
      <div className="min-h-screen bg-gray-50">
        <TutorHubHeader />
        <div className="p-6">
          <h1 className="text-xl font-semibold">Finish Tutor Setup</h1>
          <p className="text-sm text-muted-foreground">
            Your TutorProfile isn’t set up yet. Please complete your profile to continue.
          </p>
          {/* render a setup component/modal here */}
        </div>
      </div>
    );
  }

  const dto = {
    user: { id: me.id, name: me.name, email: me.email, image: me.image, role: me.role },
    tutorProfile: {
      id: me.tutorProfile.id,
      bio: me.tutorProfile.bio,
      hourlyRate: me.tutorProfile.hourlyRate?.toString() ?? null,
      availability: me.tutorProfile.availability ?? null,
      createdAt: me.tutorProfile.createdAt.toISOString(),
      updatedAt: me.tutorProfile.updatedAt.toISOString(),
    },
    accounts: me.accounts,
  } as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHydrator initial={dto} />
      <TutorHubHeader />
      <div>{children}</div>
    </div>
  );
}