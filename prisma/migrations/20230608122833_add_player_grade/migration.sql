-- CreateEnum
CREATE TYPE "PlayerGradeLevel" AS ENUM ('LIGA1', 'LIGA2', 'LIGA3', 'EKSTRAKLASA', 'ROZGRYWKI_EU');

-- CreateTable
CREATE TABLE "PlayerGrade" (
    "id" TEXT NOT NULL,
    "grade" "PlayerGradeLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "PlayerGrade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerGrade" ADD CONSTRAINT "PlayerGrade_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGrade" ADD CONSTRAINT "PlayerGrade_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
