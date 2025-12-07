/*
  Warnings:

  - You are about to drop the column `tutorAssignmentId` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `tutorAssignmentId` on the `TutoringSession` table. All the data in the column will be lost.
  - You are about to drop the `TutorAssignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tutorSubscriptionId` to the `Homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorSubscriptionId` to the `TutoringSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ModuleType" AS ENUM ('CREATING', 'TOPICS', 'CHALLENGES', 'COHORTS', 'JOURNEYS');

-- DropForeignKey
ALTER TABLE "public"."Homework" DROP CONSTRAINT "Homework_tutorAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TutorAssignment" DROP CONSTRAINT "TutorAssignment_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TutorAssignment" DROP CONSTRAINT "TutorAssignment_tutorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TutoringSession" DROP CONSTRAINT "TutoringSession_tutorAssignmentId_fkey";

-- DropIndex
DROP INDEX "public"."Homework_tutorAssignmentId_idx";

-- AlterTable
ALTER TABLE "public"."Homework" DROP COLUMN "tutorAssignmentId",
ADD COLUMN     "tutorSubscriptionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."TutoringSession" DROP COLUMN "tutorAssignmentId",
ADD COLUMN     "tutorSubscriptionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."TutorAssignment";

-- CreateTable
CREATE TABLE "public"."ModuleSubscription" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "module" "public"."ModuleType" NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TutorSubscription" (
    "id" TEXT NOT NULL,
    "tutorProfileId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModuleSubscription_studentId_idx" ON "public"."ModuleSubscription"("studentId");

-- CreateIndex
CREATE INDEX "TutorSubscription_tutorProfileId_idx" ON "public"."TutorSubscription"("tutorProfileId");

-- CreateIndex
CREATE INDEX "TutorSubscription_studentProfileId_idx" ON "public"."TutorSubscription"("studentProfileId");

-- CreateIndex
CREATE INDEX "Homework_tutorSubscriptionId_idx" ON "public"."Homework"("tutorSubscriptionId");

-- AddForeignKey
ALTER TABLE "public"."ModuleSubscription" ADD CONSTRAINT "ModuleSubscription_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorSubscription" ADD CONSTRAINT "TutorSubscription_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "public"."TutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorSubscription" ADD CONSTRAINT "TutorSubscription_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutoringSession" ADD CONSTRAINT "TutoringSession_tutorSubscriptionId_fkey" FOREIGN KEY ("tutorSubscriptionId") REFERENCES "public"."TutorSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Homework" ADD CONSTRAINT "Homework_tutorSubscriptionId_fkey" FOREIGN KEY ("tutorSubscriptionId") REFERENCES "public"."TutorSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
