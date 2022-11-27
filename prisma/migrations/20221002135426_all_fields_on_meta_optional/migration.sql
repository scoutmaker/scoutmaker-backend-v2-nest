-- DropForeignKey
ALTER TABLE "InsiderNoteMeta" DROP CONSTRAINT "InsiderNoteMeta_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "InsiderNoteMeta" DROP CONSTRAINT "InsiderNoteMeta_teamId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_positionId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_teamId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStatsMeta" DROP CONSTRAINT "PlayerStatsMeta_teamId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_positionId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_teamId_fkey";

-- AlterTable
ALTER TABLE "InsiderNoteMeta" ALTER COLUMN "teamId" DROP NOT NULL,
ALTER COLUMN "competitionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NoteMeta" ALTER COLUMN "positionId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP NOT NULL,
ALTER COLUMN "competitionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlayerStatsMeta" ALTER COLUMN "teamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ReportMeta" ALTER COLUMN "positionId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP NOT NULL,
ALTER COLUMN "competitionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "PlayerPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNoteMeta" ADD CONSTRAINT "InsiderNoteMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNoteMeta" ADD CONSTRAINT "InsiderNoteMeta_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "PlayerPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStatsMeta" ADD CONSTRAINT "PlayerStatsMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
