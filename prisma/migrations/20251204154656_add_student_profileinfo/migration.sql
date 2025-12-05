-- CreateEnum
CREATE TYPE "public"."StudentLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- AlterTable
ALTER TABLE "public"."StudentProfile" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "goals" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "level" "public"."StudentLevel" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
