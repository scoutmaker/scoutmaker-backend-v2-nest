-- DropForeignKey
ALTER TABLE "PlayerGrade" DROP CONSTRAINT "PlayerGrade_competitionId_fkey";

-- AlterTable
ALTER TABLE "PlayerGrade" ALTER COLUMN "competitionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PlayerGrade" ADD CONSTRAINT "PlayerGrade_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
