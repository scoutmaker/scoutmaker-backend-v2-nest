/*
  Warnings:

  - Added the required column `observationType` to the `MatchAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ObservationType" AS ENUM ('LIVE', 'VIDEO');

-- AlterTable
ALTER TABLE "MatchAttendance" ADD COLUMN     "observationType" "ObservationType" NOT NULL;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "observationType" "ObservationType" NOT NULL DEFAULT 'VIDEO';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "observationType" "ObservationType" NOT NULL DEFAULT 'VIDEO';
