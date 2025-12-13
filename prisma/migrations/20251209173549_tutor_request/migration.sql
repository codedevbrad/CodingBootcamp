-- AlterEnum
ALTER TYPE "public"."ModuleType" ADD VALUE 'MODULE_HOMEWORK';

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

-- CreateIndex
CREATE UNIQUE INDEX "tutor_invitations_invitationId_key" ON "public"."tutor_invitations"("invitationId");

-- CreateIndex
CREATE INDEX "tutor_invitations_invitationId_idx" ON "public"."tutor_invitations"("invitationId");

-- CreateIndex
CREATE INDEX "tutor_invitations_email_idx" ON "public"."tutor_invitations"("email");
