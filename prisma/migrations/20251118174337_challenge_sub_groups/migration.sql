-- AlterTable
ALTER TABLE "public"."Challenge" ADD COLUMN     "subGroupId" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSubGroup_key_key" ON "public"."ChallengeSubGroup"("key");

-- AddForeignKey
ALTER TABLE "public"."ChallengeSubGroup" ADD CONSTRAINT "ChallengeSubGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ChallengeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenge" ADD CONSTRAINT "Challenge_subGroupId_fkey" FOREIGN KEY ("subGroupId") REFERENCES "public"."ChallengeSubGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
