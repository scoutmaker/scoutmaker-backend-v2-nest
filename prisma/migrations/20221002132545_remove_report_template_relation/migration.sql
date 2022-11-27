/*
  Warnings:

  - You are about to drop the column `templateId` on the `Report` table. All the data in the column will be lost.
  - Added the required column `maxRatingScore` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_templateId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "templateId",
ADD COLUMN     "maxRatingScore" INTEGER NOT NULL;
