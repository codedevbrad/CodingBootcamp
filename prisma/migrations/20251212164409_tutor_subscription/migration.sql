/*
  Warnings:

  - A unique constraint covering the columns `[tutorProfileId,studentProfileId]` on the table `TutorSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."TutorRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "color" TEXT;

-- CreateTable
CREATE TABLE "public"."TutorRequest" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "tutorProfileId" TEXT NOT NULL,
    "status" "public"."TutorRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TutorRequest_tutorProfileId_status_idx" ON "public"."TutorRequest"("tutorProfileId", "status");

-- CreateIndex
CREATE INDEX "TutorRequest_studentProfileId_status_idx" ON "public"."TutorRequest"("studentProfileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TutorRequest_studentProfileId_tutorProfileId_status_key" ON "public"."TutorRequest"("studentProfileId", "tutorProfileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TutorSubscription_tutorProfileId_studentProfileId_key" ON "public"."TutorSubscription"("tutorProfileId", "studentProfileId");

-- AddForeignKey
ALTER TABLE "public"."TutorRequest" ADD CONSTRAINT "TutorRequest_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorRequest" ADD CONSTRAINT "TutorRequest_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "public"."TutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
