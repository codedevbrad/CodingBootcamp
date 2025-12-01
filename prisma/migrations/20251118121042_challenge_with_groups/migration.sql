/*
  Warnings:

  - You are about to drop the `ChallengeUnit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ChallengeUnit" DROP CONSTRAINT "ChallengeUnit_challengeId_fkey";

-- AlterTable
ALTER TABLE "public"."Challenge" ADD COLUMN     "groupId" TEXT;

-- DropTable
DROP TABLE "public"."ChallengeUnit";

-- CreateTable
CREATE TABLE "public"."ChallengeGroup" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeGroup_key_key" ON "public"."ChallengeGroup"("key");

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ChallengeGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
