/*
  Warnings:

  - You are about to drop the column `gradient` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `Challenge` table. All the data in the column will be lost.
  - Added the required column `guide` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Challenge" DROP CONSTRAINT "Challenge_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Challenge" DROP CONSTRAINT "Challenge_difficultyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Challenge" DROP CONSTRAINT "Challenge_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChallengeLanguage" DROP CONSTRAINT "ChallengeLanguage_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChallengeLanguage" DROP CONSTRAINT "ChallengeLanguage_languageId_fkey";

-- AlterTable
ALTER TABLE "public"."Challenge" DROP COLUMN "gradient",
DROP COLUMN "progress",
ADD COLUMN     "guide" JSONB NOT NULL,
ADD COLUMN     "work" JSONB NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "difficultyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ChallengeGroup" ADD COLUMN     "color" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ChallengeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "public"."Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChallengeLanguage" ADD CONSTRAINT "ChallengeLanguage_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChallengeLanguage" ADD CONSTRAINT "ChallengeLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
