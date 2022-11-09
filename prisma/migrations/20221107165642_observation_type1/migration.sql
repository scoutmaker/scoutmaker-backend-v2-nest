-- CreateEnum
CREATE TYPE "ObservationType" AS ENUM ('LIVE', 'VIDEO');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "observationType" "ObservationType";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "observationType" "ObservationType";
