-- CreateEnum
CREATE TYPE "public"."SessionLength" AS ENUM ('MIN60', 'MIN90', 'MIN120');

-- CreateEnum
CREATE TYPE "public"."HomeworkStatus" AS ENUM ('DRAFT', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'RETURNED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."TutorAssignment" DROP CONSTRAINT "TutorAssignment_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TutorAssignment" DROP CONSTRAINT "TutorAssignment_tutorProfileId_fkey";

-- AlterTable
ALTER TABLE "public"."TutorProfile" ADD COLUMN     "availability" JSONB;

-- CreateTable
CREATE TABLE "public"."TutoringSession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tutorAssignmentId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "length" "public"."SessionLength" NOT NULL DEFAULT 'MIN60',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutoringSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Homework" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tutorAssignmentId" TEXT NOT NULL,
    "tasks" JSONB NOT NULL,
    "status" "public"."HomeworkStatus" NOT NULL DEFAULT 'ASSIGNED',
    "dueDate" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),
    "grade" DECIMAL(5,2),
    "feedback" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TutoringSession_startTime_idx" ON "public"."TutoringSession"("startTime");

-- CreateIndex
CREATE INDEX "Homework_tutorAssignmentId_idx" ON "public"."Homework"("tutorAssignmentId");

-- CreateIndex
CREATE INDEX "Homework_status_idx" ON "public"."Homework"("status");

-- CreateIndex
CREATE INDEX "Homework_dueDate_idx" ON "public"."Homework"("dueDate");

-- AddForeignKey
ALTER TABLE "public"."TutorAssignment" ADD CONSTRAINT "TutorAssignment_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "public"."TutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorAssignment" ADD CONSTRAINT "TutorAssignment_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutoringSession" ADD CONSTRAINT "TutoringSession_tutorAssignmentId_fkey" FOREIGN KEY ("tutorAssignmentId") REFERENCES "public"."TutorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Homework" ADD CONSTRAINT "Homework_tutorAssignmentId_fkey" FOREIGN KEY ("tutorAssignmentId") REFERENCES "public"."TutorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
