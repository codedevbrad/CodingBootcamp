/*
  Warnings:

  - You are about to drop the column `endDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentProfileId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Subscription_endDate_idx";

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "endDate",
DROP COLUMN "startDate";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_studentProfileId_key" ON "public"."Subscription"("studentProfileId");
