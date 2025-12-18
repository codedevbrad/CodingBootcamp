-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'TUTOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "public"."StudentLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."ModuleType" AS ENUM ('CREATING', 'TOPICS', 'CHALLENGES', 'COHORTS', 'JOURNEYS', 'MODULE_HOMEWORK');

-- CreateEnum
CREATE TYPE "public"."TutorRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SessionLength" AS ENUM ('MAX60', 'MAX90', 'MAX120');

-- CreateEnum
CREATE TYPE "public"."TutoringSessionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'POSTPONED', 'MISSED', 'NO_SHOW', 'NO_SHOW_NO_REASON', 'NO_SHOW_WITH_REASON', 'NO_SHOW_WITH_REASON_AND_RESCHEDULED');

-- CreateEnum
CREATE TYPE "public"."HomeworkStatus" AS ENUM ('DRAFT', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'RETURNED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."WorkReviewStatus" AS ENUM ('WAITING_FOR_REVIEW', 'REVIEWED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."service_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "keys" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'STUDENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tutor_invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "usedBy" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "tutor_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TutorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "hourlyRate" INTEGER,
    "availability" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "public"."StudentLevel" NOT NULL DEFAULT 'BEGINNER',
    "bio" TEXT NOT NULL DEFAULT '',
    "countryCode" TEXT NOT NULL DEFAULT '',
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goals" TEXT NOT NULL DEFAULT '',
    "streak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "public"."TutorRequest" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "tutorProfileId" TEXT NOT NULL,
    "status" "public"."TutorRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorRequest_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "public"."TutoringSessionCategory" (
    "sessionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TutoringSessionCategory_pkey" PRIMARY KEY ("sessionId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."TutoringSession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TutoringSessionStatus" NOT NULL DEFAULT 'PENDING',
    "tutorSubscriptionId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "length" "public"."SessionLength" NOT NULL DEFAULT 'MAX60',
    "preSessionNotes" JSONB,
    "postSessionContent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutoringSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Homework" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tutorSubscriptionId" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "summary" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "studentProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inspiration" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "sourceUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspiration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB,
    "guide" JSONB,
    "estHours" INTEGER NOT NULL,
    "color" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficultyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectCategory" (
    "projectId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("projectId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."ProjectLanguage" (
    "projectId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "ProjectLanguage_pkey" PRIMARY KEY ("projectId","languageId")
);

-- CreateTable
CREATE TABLE "public"."ChallengeGroup" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChallengeSubGroup" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeSubGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Challenge" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estMins" INTEGER NOT NULL,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "work" JSONB NOT NULL,
    "guide" JSONB NOT NULL,
    "groupId" TEXT NOT NULL,
    "subGroupId" TEXT,
    "categoryId" TEXT,
    "difficultyId" TEXT,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChallengeLanguage" (
    "challengeId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "ChallengeLanguage_pkey" PRIMARY KEY ("challengeId","languageId")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Difficulty" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Difficulty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Language" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Concept" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estMins" INTEGER,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "content" JSONB,
    "blockData" JSONB,
    "guide" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conceptId" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TopicLanguage" (
    "topicId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "TopicLanguage_pkey" PRIMARY KEY ("topicId","languageId")
);

-- CreateTable
CREATE TABLE "public"."TopicCategory" (
    "topicId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TopicCategory_pkey" PRIMARY KEY ("topicId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."Block" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "summary" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TopicBlock" (
    "id" TEXT NOT NULL,
    "summary" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "blockId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicBlock_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."StudentInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,

    CONSTRAINT "StudentInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "service_keys_userId_service_key" ON "public"."service_keys"("userId", "service");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "public"."AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_invitations_invitationId_key" ON "public"."tutor_invitations"("invitationId");

-- CreateIndex
CREATE INDEX "tutor_invitations_invitationId_idx" ON "public"."tutor_invitations"("invitationId");

-- CreateIndex
CREATE INDEX "tutor_invitations_email_idx" ON "public"."tutor_invitations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TutorProfile_userId_key" ON "public"."TutorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "public"."StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "ModuleSubscription_studentId_idx" ON "public"."ModuleSubscription"("studentId");

-- CreateIndex
CREATE INDEX "TutorRequest_tutorProfileId_status_idx" ON "public"."TutorRequest"("tutorProfileId", "status");

-- CreateIndex
CREATE INDEX "TutorRequest_studentProfileId_status_idx" ON "public"."TutorRequest"("studentProfileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TutorRequest_studentProfileId_tutorProfileId_status_key" ON "public"."TutorRequest"("studentProfileId", "tutorProfileId", "status");

-- CreateIndex
CREATE INDEX "TutorSubscription_tutorProfileId_idx" ON "public"."TutorSubscription"("tutorProfileId");

-- CreateIndex
CREATE INDEX "TutorSubscription_studentProfileId_idx" ON "public"."TutorSubscription"("studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "TutorSubscription_tutorProfileId_studentProfileId_key" ON "public"."TutorSubscription"("tutorProfileId", "studentProfileId");

-- CreateIndex
CREATE INDEX "TutoringSession_startTime_idx" ON "public"."TutoringSession"("startTime");

-- CreateIndex
CREATE INDEX "Homework_tutorSubscriptionId_idx" ON "public"."Homework"("tutorSubscriptionId");

-- CreateIndex
CREATE INDEX "Homework_status_idx" ON "public"."Homework"("status");

-- CreateIndex
CREATE INDEX "Homework_dueDate_idx" ON "public"."Homework"("dueDate");

-- CreateIndex
CREATE INDEX "Note_studentProfileId_idx" ON "public"."Note"("studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeGroup_key_key" ON "public"."ChallengeGroup"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSubGroup_key_key" ON "public"."ChallengeSubGroup"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_slug_key" ON "public"."Challenge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_key_key" ON "public"."Category"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Difficulty_key_key" ON "public"."Difficulty"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Language_key_key" ON "public"."Language"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Concept_key_key" ON "public"."Concept"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "public"."Topic"("slug");

-- CreateIndex
CREATE INDEX "TopicBlock_topicId_order_idx" ON "public"."TopicBlock"("topicId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "TopicBlock_blockId_topicId_key" ON "public"."TopicBlock"("blockId", "topicId");

-- CreateIndex
CREATE INDEX "WorkReview_tutorSubscriptionId_idx" ON "public"."WorkReview"("tutorSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentInvite_invitationId_key" ON "public"."StudentInvite"("invitationId");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_keys" ADD CONSTRAINT "service_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorProfile" ADD CONSTRAINT "TutorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleSubscription" ADD CONSTRAINT "ModuleSubscription_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorRequest" ADD CONSTRAINT "TutorRequest_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorRequest" ADD CONSTRAINT "TutorRequest_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "public"."TutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorSubscription" ADD CONSTRAINT "TutorSubscription_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "public"."TutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorSubscription" ADD CONSTRAINT "TutorSubscription_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutoringSessionCategory" ADD CONSTRAINT "TutoringSessionCategory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."TutoringSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutoringSessionCategory" ADD CONSTRAINT "TutoringSessionCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutoringSession" ADD CONSTRAINT "TutoringSession_tutorSubscriptionId_fkey" FOREIGN KEY ("tutorSubscriptionId") REFERENCES "public"."TutorSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Homework" ADD CONSTRAINT "Homework_tutorSubscriptionId_fkey" FOREIGN KEY ("tutorSubscriptionId") REFERENCES "public"."TutorSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "public"."Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectCategory" ADD CONSTRAINT "ProjectCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectCategory" ADD CONSTRAINT "ProjectCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectLanguage" ADD CONSTRAINT "ProjectLanguage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectLanguage" ADD CONSTRAINT "ProjectLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChallengeSubGroup" ADD CONSTRAINT "ChallengeSubGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ChallengeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ChallengeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_subGroupId_fkey" FOREIGN KEY ("subGroupId") REFERENCES "public"."ChallengeSubGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "public"."Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChallengeLanguage" ADD CONSTRAINT "ChallengeLanguage_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChallengeLanguage" ADD CONSTRAINT "ChallengeLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topic" ADD CONSTRAINT "Topic_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "public"."Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicLanguage" ADD CONSTRAINT "TopicLanguage_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicLanguage" ADD CONSTRAINT "TopicLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicCategory" ADD CONSTRAINT "TopicCategory_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicCategory" ADD CONSTRAINT "TopicCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicBlock" ADD CONSTRAINT "TopicBlock_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "public"."Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicBlock" ADD CONSTRAINT "TopicBlock_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkReview" ADD CONSTRAINT "WorkReview_tutorSubscriptionId_fkey" FOREIGN KEY ("tutorSubscriptionId") REFERENCES "public"."TutorSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
