/*
  Warnings:

  - You are about to drop the column `compactCategories` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `compactCategories` on the `ReportTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "compactCategories",
ADD COLUMN     "compactCategoriesIds" TEXT[];

-- AlterTable
ALTER TABLE "ReportTemplate" DROP COLUMN "compactCategories",
ADD COLUMN     "compactCategoriesIds" TEXT[];
