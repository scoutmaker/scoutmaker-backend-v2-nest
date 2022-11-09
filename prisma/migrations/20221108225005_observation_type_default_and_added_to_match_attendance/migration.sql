/*
  Warnings:

  - Added the required column `observationType` to the `MatchAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchAttendance" ADD COLUMN     "observationType" "ObservationType" NOT NULL;

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "observationType" SET DEFAULT E'VIDEO';

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "observationType" SET DEFAULT E'VIDEO';
