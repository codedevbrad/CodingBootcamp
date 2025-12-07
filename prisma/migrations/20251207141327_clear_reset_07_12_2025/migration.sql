/*
  Warnings:

  - You are about to drop the column `status` on the `TutorAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `TutorAssignment` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TutorAssignment" DROP CONSTRAINT "TutorAssignment_subscriptionId_fkey";

-- DropIndex
DROP INDEX "public"."TutorAssignment_subscriptionId_key";

-- AlterTable
ALTER TABLE "public"."TutorAssignment" DROP COLUMN "status",
DROP COLUMN "subscriptionId";

-- DropTable
DROP TABLE "public"."Subscription";

-- DropEnum
DROP TYPE "public"."AssignmentStatus";

-- DropEnum
DROP TYPE "public"."SubscriptionStatus";

-- DropEnum
DROP TYPE "public"."SubscriptionTier";
