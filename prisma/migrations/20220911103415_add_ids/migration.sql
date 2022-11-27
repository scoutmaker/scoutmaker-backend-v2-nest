/*
  Warnings:

  - The primary key for the `CompetitionGroupsOnOrganizationSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CompetitionGroupsOnUserSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CompetitionParticipation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CompetitionsOnOrganizationSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CompetitionsOnUserSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FollowAgency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FollowPlayer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FollowScout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FollowTeam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikeInsiderNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikeNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikePlayer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikeReport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikeTeam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MatchAttendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RegionsOnCompetitionGroups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SecondaryPositionsOnPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SkillAssessmentTemplatesOnReportTemplates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[subscriptionId,groupId]` on the table `CompetitionGroupsOnOrganizationSubscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscriptionId,groupId]` on the table `CompetitionGroupsOnUserSubscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,competitionId,seasonId]` on the table `CompetitionParticipation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscriptionId,competitionId]` on the table `CompetitionsOnOrganizationSubscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscriptionId,competitionId]` on the table `CompetitionsOnUserSubscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[agencyId,followerId]` on the table `FollowAgency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId,followerId]` on the table `FollowPlayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scoutId,followerId]` on the table `FollowScout` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,followerId]` on the table `FollowTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[insiderNoteId,userId]` on the table `LikeInsiderNote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[noteId,userId]` on the table `LikeNote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId,userId]` on the table `LikePlayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reportId,userId]` on the table `LikeReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,userId]` on the table `LikeTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[matchId,userId]` on the table `MatchAttendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[regionId,groupId]` on the table `RegionsOnCompetitionGroups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId,playerPositionId]` on the table `SecondaryPositionsOnPlayers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reportTemplateId,skillAssessmentTemplateId]` on the table `SkillAssessmentTemplatesOnReportTemplates` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `CompetitionGroupsOnOrganizationSubscriptions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `CompetitionGroupsOnUserSubscriptions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `CompetitionParticipation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `CompetitionsOnOrganizationSubscriptions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `CompetitionsOnUserSubscriptions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `FollowAgency` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `FollowPlayer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `FollowScout` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `FollowTeam` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `LikeInsiderNote` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `LikeNote` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `LikePlayer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `LikeReport` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `LikeTeam` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `MatchAttendance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `RegionsOnCompetitionGroups` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `SecondaryPositionsOnPlayers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `SkillAssessmentTemplatesOnReportTemplates` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "CompetitionGroupsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionGroupsOnUserSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnUserSubscriptions_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CompetitionGroupsOnUserSubscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CompetitionParticipation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionsOnOrganizationSubscriptions_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CompetitionsOnOrganizationSubscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionsOnUserSubscriptions" DROP CONSTRAINT "CompetitionsOnUserSubscriptions_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CompetitionsOnUserSubscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FollowAgency" DROP CONSTRAINT "FollowAgency_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FollowAgency_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FollowPlayer" DROP CONSTRAINT "FollowPlayer_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FollowPlayer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FollowScout" DROP CONSTRAINT "FollowScout_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FollowScout_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FollowTeam" DROP CONSTRAINT "FollowTeam_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FollowTeam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LikeInsiderNote" DROP CONSTRAINT "LikeInsiderNote_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikeInsiderNote_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LikeNote" DROP CONSTRAINT "LikeNote_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikeNote_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LikePlayer" DROP CONSTRAINT "LikePlayer_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikePlayer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LikeReport" DROP CONSTRAINT "LikeReport_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikeReport_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LikeTeam" DROP CONSTRAINT "LikeTeam_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikeTeam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MatchAttendance" DROP CONSTRAINT "MatchAttendance_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "MatchAttendance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RegionsOnCompetitionGroups" DROP CONSTRAINT "RegionsOnCompetitionGroups_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RegionsOnCompetitionGroups_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SecondaryPositionsOnPlayers" DROP CONSTRAINT "SecondaryPositionsOnPlayers_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SecondaryPositionsOnPlayers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SkillAssessmentTemplatesOnReportTemplates" DROP CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionGroupsOnOrganizationSubscriptions_subscriptionId_key" ON "CompetitionGroupsOnOrganizationSubscriptions"("subscriptionId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionGroupsOnUserSubscriptions_subscriptionId_groupId_key" ON "CompetitionGroupsOnUserSubscriptions"("subscriptionId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionParticipation_teamId_competitionId_seasonId_key" ON "CompetitionParticipation"("teamId", "competitionId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionsOnOrganizationSubscriptions_subscriptionId_comp_key" ON "CompetitionsOnOrganizationSubscriptions"("subscriptionId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionsOnUserSubscriptions_subscriptionId_competitionI_key" ON "CompetitionsOnUserSubscriptions"("subscriptionId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowAgency_agencyId_followerId_key" ON "FollowAgency"("agencyId", "followerId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowPlayer_playerId_followerId_key" ON "FollowPlayer"("playerId", "followerId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowScout_scoutId_followerId_key" ON "FollowScout"("scoutId", "followerId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowTeam_teamId_followerId_key" ON "FollowTeam"("teamId", "followerId");

-- CreateIndex
CREATE UNIQUE INDEX "LikeInsiderNote_insiderNoteId_userId_key" ON "LikeInsiderNote"("insiderNoteId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LikeNote_noteId_userId_key" ON "LikeNote"("noteId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LikePlayer_playerId_userId_key" ON "LikePlayer"("playerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LikeReport_reportId_userId_key" ON "LikeReport"("reportId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LikeTeam_teamId_userId_key" ON "LikeTeam"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchAttendance_matchId_userId_key" ON "MatchAttendance"("matchId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "RegionsOnCompetitionGroups_regionId_groupId_key" ON "RegionsOnCompetitionGroups"("regionId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "SecondaryPositionsOnPlayers_playerId_playerPositionId_key" ON "SecondaryPositionsOnPlayers"("playerId", "playerPositionId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillAssessmentTemplatesOnReportTemplates_reportTemplateId__key" ON "SkillAssessmentTemplatesOnReportTemplates"("reportTemplateId", "skillAssessmentTemplateId");
