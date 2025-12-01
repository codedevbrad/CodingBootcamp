/*
  Warnings:

  - Made the column `groupId` on table `Challenge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Challenge" ALTER COLUMN "groupId" SET NOT NULL;
