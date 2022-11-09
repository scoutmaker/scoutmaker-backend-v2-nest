/*
  Warnings:

  - Made the column `observationType` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Made the column `observationType` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "observationType" SET NOT NULL;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "observationType" SET NOT NULL;
