/*
  Warnings:

  - You are about to alter the column `hourlyRate` on the `TutorProfile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "public"."WorkReviewStatus" AS ENUM ('WAITING_FOR_REVIEW', 'REVIEWED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."TutorProfile" ALTER COLUMN "hourlyRate" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "public"."WorkReview" (
    "id" TEXT NOT NULL,
    "tutorSubscriptionId" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "reviewContent" JSONB NOT NULL,
    "studentComments" JSONB NOT NULL,
    "status" "public"."WorkReviewStatus" NOT NULL DEFAULT 'WAITING_FOR_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkReview_tutorSubscriptionId_idx" ON "public"."WorkReview"("tutorSubscriptionId");

-- AddForeignKey
ALTER TABLE "public"."WorkReview" ADD CONSTRAINT "WorkReview_tutorSubscriptionId_fkey" FOREIGN KEY ("tutorSubscriptionId") REFERENCES "public"."TutorSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
