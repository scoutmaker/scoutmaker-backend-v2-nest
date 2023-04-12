/*
  Warnings:

  - You are about to drop the column `templateId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_templateId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "templateId",
ADD COLUMN     "skillsOrder" TEXT[];
