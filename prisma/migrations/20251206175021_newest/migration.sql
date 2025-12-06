/*
  Warnings:

  - The values [FREE] on the enum `SubscriptionTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."SubscriptionTier_new" AS ENUM ('BASIC', 'TUTORED');
ALTER TABLE "public"."Subscription" ALTER COLUMN "tier" TYPE "public"."SubscriptionTier_new" USING ("tier"::text::"public"."SubscriptionTier_new");
ALTER TYPE "public"."SubscriptionTier" RENAME TO "SubscriptionTier_old";
ALTER TYPE "public"."SubscriptionTier_new" RENAME TO "SubscriptionTier";
DROP TYPE "public"."SubscriptionTier_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Subscription" ALTER COLUMN "tier" SET DEFAULT 'BASIC',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
