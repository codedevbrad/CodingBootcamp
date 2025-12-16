/*
  Warnings:

  - The values [MIN60,MIN90,MIN120] on the enum `SessionLength` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."TutoringSessionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'POSTPONED', 'MISSED', 'NO_SHOW', 'NO_SHOW_NO_REASON', 'NO_SHOW_WITH_REASON', 'NO_SHOW_WITH_REASON_AND_RESCHEDULED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."SessionLength_new" AS ENUM ('MAX60', 'MAX90', 'MAX120');
ALTER TABLE "public"."TutoringSession" ALTER COLUMN "length" DROP DEFAULT;
ALTER TABLE "public"."TutoringSession" ALTER COLUMN "length" TYPE "public"."SessionLength_new" USING ("length"::text::"public"."SessionLength_new");
ALTER TYPE "public"."SessionLength" RENAME TO "SessionLength_old";
ALTER TYPE "public"."SessionLength_new" RENAME TO "SessionLength";
DROP TYPE "public"."SessionLength_old";
ALTER TABLE "public"."TutoringSession" ALTER COLUMN "length" SET DEFAULT 'MAX60';
COMMIT;

-- AlterTable
ALTER TABLE "public"."TutoringSession" ADD COLUMN     "postSessionContent" JSONB,
ADD COLUMN     "preSessionNotes" JSONB,
ADD COLUMN     "status" "public"."TutoringSessionStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "length" SET DEFAULT 'MAX60';

-- CreateTable
CREATE TABLE "public"."TutoringSessionCategory" (
    "sessionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TutoringSessionCategory_pkey" PRIMARY KEY ("sessionId","categoryId")
);

-- AddForeignKey
ALTER TABLE "public"."TutoringSessionCategory" ADD CONSTRAINT "TutoringSessionCategory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."TutoringSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutoringSessionCategory" ADD CONSTRAINT "TutoringSessionCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
