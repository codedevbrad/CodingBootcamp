-- CreateEnum
CREATE TYPE "public"."ChallengeWorkType" AS ENUM ('CODE', 'EXERCISE', 'DIAGRAM');

-- AlterTable
ALTER TABLE "public"."Challenge" ADD COLUMN     "workType" "public"."ChallengeWorkType" NOT NULL DEFAULT 'CODE';
