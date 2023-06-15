/*
  Warnings:

  - The values [ROZGRYWKI_EU] on the enum `PlayerGradeLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlayerGradeLevel_new" AS ENUM ('LIGA1', 'LIGA2', 'LIGA3', 'EKSTRAKLASA', 'EEU_ROZGRYWKI');
ALTER TABLE "PlayerGrade" ALTER COLUMN "grade" TYPE "PlayerGradeLevel_new" USING ("grade"::text::"PlayerGradeLevel_new");
ALTER TYPE "PlayerGradeLevel" RENAME TO "PlayerGradeLevel_old";
ALTER TYPE "PlayerGradeLevel_new" RENAME TO "PlayerGradeLevel";
DROP TYPE "PlayerGradeLevel_old";
COMMIT;
