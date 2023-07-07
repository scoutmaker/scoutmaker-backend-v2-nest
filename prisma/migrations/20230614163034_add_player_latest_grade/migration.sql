-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "latestGradeId" TEXT;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_latestGradeId_fkey" FOREIGN KEY ("latestGradeId") REFERENCES "PlayerGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
