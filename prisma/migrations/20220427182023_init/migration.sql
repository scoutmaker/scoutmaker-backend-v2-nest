-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SCOUT', 'PLAYMAKER_SCOUT', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Foot" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('OPEN', 'ACCEPTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AccessControlEntryPermissionLevel" AS ENUM ('READ', 'READ_AND_WRITE', 'FULL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT E'SCOUT',
    "status" "AccountStatus" NOT NULL DEFAULT E'PENDING',
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "password" TEXT NOT NULL,
    "activeRadius" INTEGER NOT NULL DEFAULT 0,
    "confirmationCode" TEXT,
    "confirmationCodeExpiryDate" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "resetPasswordExpiryDate" TIMESTAMP(3),
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionId" TEXT NOT NULL,
    "footballRoleId" TEXT,
    "clubId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFootballRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFootballRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isEuMember" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lnpId" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "street" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countryId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "minut90url" TEXT,
    "transfermarktUrl" TEXT,
    "lnpId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clubId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER,
    "gender" "Gender" NOT NULL DEFAULT E'MALE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countryId" TEXT NOT NULL,
    "ageCategoryId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "juniorLevelId" TEXT,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "CompetitionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionsOnCompetitionGroups" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "RegionsOnCompetitionGroups_pkey" PRIMARY KEY ("regionId","groupId")
);

-- CreateTable
CREATE TABLE "CompetitionAgeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionAgeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionJuniorLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionJuniorLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionParticipation" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "groupId" TEXT,

    CONSTRAINT "CompetitionParticipation_pkey" PRIMARY KEY ("teamId","competitionId","seasonId")
);

-- CreateTable
CREATE TABLE "PlayerPosition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "yearOfBirth" INTEGER NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "footed" "Foot" NOT NULL,
    "lnpId" TEXT,
    "lnpUrl" TEXT,
    "minut90id" TEXT,
    "minut90url" TEXT,
    "transfermarktId" TEXT,
    "transfermarktUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countryId" TEXT NOT NULL,
    "primaryPositionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondaryPositionsOnPlayers" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "playerPositionId" TEXT NOT NULL,

    CONSTRAINT "SecondaryPositionsOnPlayers_pkey" PRIMARY KEY ("playerId","playerPositionId")
);

-- CreateTable
CREATE TABLE "TeamAffiliation" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "TeamAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "homeGoals" INTEGER,
    "awayGoals" INTEGER,
    "videoUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "groupId" TEXT,
    "seasonId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "docNumber" SERIAL NOT NULL,
    "shirtNo" INTEGER,
    "description" TEXT,
    "maxRatingScore" INTEGER,
    "rating" INTEGER,
    "percentageRating" DOUBLE PRECISION,
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT,
    "matchId" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteMeta" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "noteId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "competitionGroupId" TEXT,

    CONSTRAINT "NoteMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsiderNote" (
    "id" TEXT NOT NULL,
    "docNumber" SERIAL NOT NULL,
    "informant" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "InsiderNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsiderNoteMeta" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "insiderNoteId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "competitionGroupId" TEXT,

    CONSTRAINT "InsiderNoteMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSkillAssessmentCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "ReportSkillAssessmentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSkillAssessmentTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "hasScore" BOOLEAN NOT NULL,
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "ReportSkillAssessmentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maxRatingScore" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillAssessmentTemplatesOnReportTemplates" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reportTemplateId" TEXT NOT NULL,
    "skillAssessmentTemplateId" TEXT NOT NULL,

    CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_pkey" PRIMARY KEY ("reportTemplateId","skillAssessmentTemplateId")
);

-- CreateTable
CREATE TABLE "ReportSkillAssessment" (
    "id" TEXT NOT NULL,
    "rating" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "ReportSkillAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "docNumber" SERIAL NOT NULL,
    "shirtNo" INTEGER,
    "minutesPlayed" INTEGER,
    "goals" INTEGER,
    "assists" INTEGER,
    "yellowCards" INTEGER,
    "redCards" INTEGER,
    "videoUrl" TEXT,
    "videoDescription" TEXT,
    "finalRating" INTEGER,
    "summary" TEXT,
    "avgRating" DOUBLE PRECISION,
    "percentageRating" DOUBLE PRECISION,
    "status" "ReportStatus" NOT NULL DEFAULT E'IN_PROGRESS',
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT,
    "orderId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportMeta" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reportId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "competitionGroupId" TEXT,

    CONSTRAINT "ReportMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "docNumber" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT E'OPEN',
    "description" TEXT,
    "acceptDate" TIMESTAMP(3),
    "closeDate" TIMESTAMP(3),
    "scoutmakerv1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "scoutId" TEXT,
    "playerId" TEXT,
    "matchId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT,
    "postalCode" TEXT,
    "street" TEXT,
    "transfermarktUrl" TEXT,
    "email" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyAffiliation" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "AgencyAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowPlayer" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,

    CONSTRAINT "FollowPlayer_pkey" PRIMARY KEY ("playerId","followerId")
);

-- CreateTable
CREATE TABLE "FollowTeam" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,

    CONSTRAINT "FollowTeam_pkey" PRIMARY KEY ("teamId","followerId")
);

-- CreateTable
CREATE TABLE "FollowScout" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scoutId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,

    CONSTRAINT "FollowScout_pkey" PRIMARY KEY ("scoutId","followerId")
);

-- CreateTable
CREATE TABLE "FollowAgency" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agencyId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,

    CONSTRAINT "FollowAgency_pkey" PRIMARY KEY ("agencyId","followerId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL,
    "minutesPlayed" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerStatsMeta" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statsId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "PlayerStatsMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportBackgroundImage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportBackgroundImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionsOnUserSubscriptions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "CompetitionsOnUserSubscriptions_pkey" PRIMARY KEY ("subscriptionId","competitionId")
);

-- CreateTable
CREATE TABLE "CompetitionGroupsOnUserSubscriptions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "CompetitionGroupsOnUserSubscriptions_pkey" PRIMARY KEY ("subscriptionId","groupId")
);

-- CreateTable
CREATE TABLE "OrganizationSubscription" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionsOnOrganizationSubscriptions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "CompetitionsOnOrganizationSubscriptions_pkey" PRIMARY KEY ("subscriptionId","competitionId")
);

-- CreateTable
CREATE TABLE "CompetitionGroupsOnOrganizationSubscriptions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_pkey" PRIMARY KEY ("subscriptionId","groupId")
);

-- CreateTable
CREATE TABLE "user_player_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "user_player_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_player_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "organization_player_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_report_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "user_report_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_report_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "organization_report_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_note_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "user_note_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_note_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "organization_note_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_insider_note_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "insiderNoteId" TEXT NOT NULL,

    CONSTRAINT "user_insider_note_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_insider_note_access_control_list" (
    "id" TEXT NOT NULL,
    "permissionLevel" "AccessControlEntryPermissionLevel" NOT NULL DEFAULT E'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "insiderNoteId" TEXT NOT NULL,

    CONSTRAINT "organization_insider_note_access_control_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationCode_key" ON "User"("confirmationCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_scoutmakerv1Id_key" ON "User"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_countryId_key" ON "Region"("name", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Club_slug_key" ON "Club"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Team_scoutmakerv1Id_key" ON "Team"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Season_isActive_key" ON "Season"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_level_countryId_key" ON "Competition"("level", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionGroup_name_competitionId_key" ON "CompetitionGroup"("name", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerPosition_code_key" ON "PlayerPosition"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Player_slug_key" ON "Player"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Player_scoutmakerv1Id_key" ON "Player"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_scoutmakerv1Id_key" ON "Match"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Note_scoutmakerv1Id_key" ON "Note"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "NoteMeta_noteId_key" ON "NoteMeta"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "InsiderNoteMeta_insiderNoteId_key" ON "InsiderNoteMeta"("insiderNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportSkillAssessmentTemplate_scoutmakerv1Id_key" ON "ReportSkillAssessmentTemplate"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "ReportTemplate_scoutmakerv1Id_key" ON "ReportTemplate"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_scoutmakerv1Id_key" ON "Report"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "ReportMeta_reportId_key" ON "ReportMeta"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_scoutmakerv1Id_key" ON "Order"("scoutmakerv1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_slug_key" ON "Agency"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_matchId_key" ON "PlayerStats"("playerId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStatsMeta_statsId_key" ON "PlayerStatsMeta"("statsId");

-- CreateIndex
CREATE UNIQUE INDEX "user_player_access_control_list_userId_playerId_key" ON "user_player_access_control_list"("userId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_player_access_control_list_organizationId_play_key" ON "organization_player_access_control_list"("organizationId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_report_access_control_list_userId_reportId_key" ON "user_report_access_control_list"("userId", "reportId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_report_access_control_list_organizationId_repo_key" ON "organization_report_access_control_list"("organizationId", "reportId");

-- CreateIndex
CREATE UNIQUE INDEX "user_note_access_control_list_userId_noteId_key" ON "user_note_access_control_list"("userId", "noteId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_note_access_control_list_organizationId_noteId_key" ON "organization_note_access_control_list"("organizationId", "noteId");

-- CreateIndex
CREATE UNIQUE INDEX "user_insider_note_access_control_list_userId_insiderNoteId_key" ON "user_insider_note_access_control_list"("userId", "insiderNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_insider_note_access_control_list_organizationI_key" ON "organization_insider_note_access_control_list"("organizationId", "insiderNoteId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_footballRoleId_fkey" FOREIGN KEY ("footballRoleId") REFERENCES "UserFootballRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_ageCategoryId_fkey" FOREIGN KEY ("ageCategoryId") REFERENCES "CompetitionAgeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "CompetitionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_juniorLevelId_fkey" FOREIGN KEY ("juniorLevelId") REFERENCES "CompetitionJuniorLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionGroup" ADD CONSTRAINT "CompetitionGroup_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionsOnCompetitionGroups" ADD CONSTRAINT "RegionsOnCompetitionGroups_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionsOnCompetitionGroups" ADD CONSTRAINT "RegionsOnCompetitionGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CompetitionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CompetitionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_primaryPositionId_fkey" FOREIGN KEY ("primaryPositionId") REFERENCES "PlayerPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondaryPositionsOnPlayers" ADD CONSTRAINT "SecondaryPositionsOnPlayers_playerPositionId_fkey" FOREIGN KEY ("playerPositionId") REFERENCES "PlayerPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondaryPositionsOnPlayers" ADD CONSTRAINT "SecondaryPositionsOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAffiliation" ADD CONSTRAINT "TeamAffiliation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAffiliation" ADD CONSTRAINT "TeamAffiliation_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CompetitionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_competitionGroupId_fkey" FOREIGN KEY ("competitionGroupId") REFERENCES "CompetitionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "PlayerPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNote" ADD CONSTRAINT "InsiderNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNote" ADD CONSTRAINT "InsiderNote_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNoteMeta" ADD CONSTRAINT "InsiderNoteMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNoteMeta" ADD CONSTRAINT "InsiderNoteMeta_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNoteMeta" ADD CONSTRAINT "InsiderNoteMeta_competitionGroupId_fkey" FOREIGN KEY ("competitionGroupId") REFERENCES "CompetitionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsiderNoteMeta" ADD CONSTRAINT "InsiderNoteMeta_insiderNoteId_fkey" FOREIGN KEY ("insiderNoteId") REFERENCES "InsiderNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSkillAssessmentCategory" ADD CONSTRAINT "ReportSkillAssessmentCategory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSkillAssessmentTemplate" ADD CONSTRAINT "ReportSkillAssessmentTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSkillAssessmentTemplate" ADD CONSTRAINT "ReportSkillAssessmentTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReportSkillAssessmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTemplate" ADD CONSTRAINT "ReportTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillAssessmentTemplatesOnReportTemplates" ADD CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_skillAssessmentT_fkey" FOREIGN KEY ("skillAssessmentTemplateId") REFERENCES "ReportSkillAssessmentTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillAssessmentTemplatesOnReportTemplates" ADD CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_reportTemplateId_fkey" FOREIGN KEY ("reportTemplateId") REFERENCES "ReportTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSkillAssessment" ADD CONSTRAINT "ReportSkillAssessment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ReportSkillAssessmentTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSkillAssessment" ADD CONSTRAINT "ReportSkillAssessment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ReportTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_competitionGroupId_fkey" FOREIGN KEY ("competitionGroupId") REFERENCES "CompetitionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "PlayerPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyAffiliation" ADD CONSTRAINT "AgencyAffiliation_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyAffiliation" ADD CONSTRAINT "AgencyAffiliation_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowPlayer" ADD CONSTRAINT "FollowPlayer_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowPlayer" ADD CONSTRAINT "FollowPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowTeam" ADD CONSTRAINT "FollowTeam_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowTeam" ADD CONSTRAINT "FollowTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowScout" ADD CONSTRAINT "FollowScout_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowScout" ADD CONSTRAINT "FollowScout_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowAgency" ADD CONSTRAINT "FollowAgency_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowAgency" ADD CONSTRAINT "FollowAgency_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStatsMeta" ADD CONSTRAINT "PlayerStatsMeta_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStatsMeta" ADD CONSTRAINT "PlayerStatsMeta_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "PlayerStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionsOnUserSubscriptions" ADD CONSTRAINT "CompetitionsOnUserSubscriptions_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionsOnUserSubscriptions" ADD CONSTRAINT "CompetitionsOnUserSubscriptions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "UserSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionGroupsOnUserSubscriptions" ADD CONSTRAINT "CompetitionGroupsOnUserSubscriptions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CompetitionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionGroupsOnUserSubscriptions" ADD CONSTRAINT "CompetitionGroupsOnUserSubscriptions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "UserSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSubscription" ADD CONSTRAINT "OrganizationSubscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionsOnOrganizationSubscriptions" ADD CONSTRAINT "CompetitionsOnOrganizationSubscriptions_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionsOnOrganizationSubscriptions" ADD CONSTRAINT "CompetitionsOnOrganizationSubscriptions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "OrganizationSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionGroupsOnOrganizationSubscriptions" ADD CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CompetitionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionGroupsOnOrganizationSubscriptions" ADD CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_subscriptionI_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "OrganizationSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_player_access_control_list" ADD CONSTRAINT "user_player_access_control_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_player_access_control_list" ADD CONSTRAINT "user_player_access_control_list_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_player_access_control_list" ADD CONSTRAINT "organization_player_access_control_list_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_player_access_control_list" ADD CONSTRAINT "organization_player_access_control_list_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_report_access_control_list" ADD CONSTRAINT "user_report_access_control_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_report_access_control_list" ADD CONSTRAINT "user_report_access_control_list_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_report_access_control_list" ADD CONSTRAINT "organization_report_access_control_list_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_report_access_control_list" ADD CONSTRAINT "organization_report_access_control_list_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_note_access_control_list" ADD CONSTRAINT "user_note_access_control_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_note_access_control_list" ADD CONSTRAINT "user_note_access_control_list_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_note_access_control_list" ADD CONSTRAINT "organization_note_access_control_list_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_note_access_control_list" ADD CONSTRAINT "organization_note_access_control_list_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_insider_note_access_control_list" ADD CONSTRAINT "user_insider_note_access_control_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_insider_note_access_control_list" ADD CONSTRAINT "user_insider_note_access_control_list_insiderNoteId_fkey" FOREIGN KEY ("insiderNoteId") REFERENCES "InsiderNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_insider_note_access_control_list" ADD CONSTRAINT "organization_insider_note_access_control_list_insiderNoteI_fkey" FOREIGN KEY ("insiderNoteId") REFERENCES "InsiderNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_insider_note_access_control_list" ADD CONSTRAINT "organization_insider_note_access_control_list_organization_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
