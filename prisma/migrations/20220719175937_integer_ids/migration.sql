/*
  Warnings:

  - The primary key for the `Agency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Agency` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AgencyAffiliation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AgencyAffiliation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Competition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Competition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `juniorLevelId` column on the `Competition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CompetitionAgeCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CompetitionAgeCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CompetitionGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CompetitionGroup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CompetitionGroupsOnOrganizationSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CompetitionGroupsOnUserSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CompetitionJuniorLevel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CompetitionJuniorLevel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CompetitionParticipation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `groupId` column on the `CompetitionParticipation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CompetitionType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CompetitionType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CompetitionsOnOrganizationSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CompetitionsOnUserSubscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Country` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Country` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `FollowAgency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FollowPlayer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FollowScout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FollowTeam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InsiderNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `docNumber` on the `InsiderNote` table. All the data in the column will be lost.
  - The `id` column on the `InsiderNote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `InsiderNoteMeta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `InsiderNoteMeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `competitionGroupId` column on the `InsiderNoteMeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `LikeInsiderNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikeNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikePlayer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikeReport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LikeTeam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `groupId` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MatchAttendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `docNumber` on the `Note` table. All the data in the column will be lost.
  - The `id` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `playerId` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `matchId` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `NoteMeta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `NoteMeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `competitionGroupId` column on the `NoteMeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `docNumber` on the `Order` table. All the data in the column will be lost.
  - The `id` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `scoutId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `playerId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `matchId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Organization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `OrganizationSubscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `OrganizationSubscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PlayerPosition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PlayerPosition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PlayerStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PlayerStats` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PlayerStatsMeta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PlayerStatsMeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Region` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RegionsOnCompetitionGroups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `docNumber` on the `Report` table. All the data in the column will be lost.
  - The `id` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `matchId` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `orderId` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReportBackgroundImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReportBackgroundImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReportMeta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReportMeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `competitionGroupId` column on the `ReportMeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReportSkillAssessment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReportSkillAssessment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReportSkillAssessmentCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReportSkillAssessmentCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReportSkillAssessmentTemplate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReportSkillAssessmentTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ReportTemplate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReportTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Season` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SecondaryPositionsOnPlayers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SkillAssessmentTemplatesOnReportTemplates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Team` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TeamAffiliation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TeamAffiliation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `regionId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `footballRoleId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `organizationId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserFootballRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserFootballRole` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserSubscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserSubscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `organization_insider_note_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `organization_insider_note_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `organization_note_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `organization_note_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `organization_player_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `organization_player_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `organization_report_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `organization_report_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_insider_note_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_insider_note_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_note_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_note_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_player_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_player_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_report_access_control_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_report_access_control_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `countryId` on the `Agency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Agency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `AgencyAffiliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `agencyId` on the `AgencyAffiliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `countryId` on the `Club` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `regionId` on the `Club` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Club` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `countryId` on the `Competition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ageCategoryId` on the `Competition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `typeId` on the `Competition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `CompetitionGroup` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subscriptionId` on the `CompetitionGroupsOnOrganizationSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupId` on the `CompetitionGroupsOnOrganizationSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subscriptionId` on the `CompetitionGroupsOnUserSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupId` on the `CompetitionGroupsOnUserSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `CompetitionParticipation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `CompetitionParticipation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `seasonId` on the `CompetitionParticipation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subscriptionId` on the `CompetitionsOnOrganizationSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `CompetitionsOnOrganizationSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subscriptionId` on the `CompetitionsOnUserSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `CompetitionsOnUserSubscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `agencyId` on the `FollowAgency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followerId` on the `FollowAgency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `FollowPlayer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followerId` on the `FollowPlayer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `scoutId` on the `FollowScout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followerId` on the `FollowScout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `FollowTeam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followerId` on the `FollowTeam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `InsiderNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `InsiderNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `insiderNoteId` on the `InsiderNoteMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `InsiderNoteMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `InsiderNoteMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `insiderNoteId` on the `LikeInsiderNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `LikeInsiderNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `noteId` on the `LikeNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `LikeNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `LikePlayer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `LikePlayer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reportId` on the `LikeReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `LikeReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `LikeTeam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `LikeTeam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `homeTeamId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `awayTeamId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `seasonId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `matchId` on the `MatchAttendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `MatchAttendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `noteId` on the `NoteMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `positionId` on the `NoteMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `NoteMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `NoteMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizationId` on the `OrganizationSubscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `countryId` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `primaryPositionId` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `PlayerStats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `PlayerStats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `matchId` on the `PlayerStats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `statsId` on the `PlayerStatsMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `PlayerStatsMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `countryId` on the `Region` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `regionId` on the `RegionsOnCompetitionGroups` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupId` on the `RegionsOnCompetitionGroups` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `templateId` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reportId` on the `ReportMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `positionId` on the `ReportMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `ReportMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `ReportMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `templateId` on the `ReportSkillAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reportId` on the `ReportSkillAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `ReportSkillAssessmentCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `ReportSkillAssessmentTemplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `ReportSkillAssessmentTemplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `ReportTemplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `SecondaryPositionsOnPlayers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerPositionId` on the `SecondaryPositionsOnPlayers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reportTemplateId` on the `SkillAssessmentTemplatesOnReportTemplates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `skillAssessmentTemplateId` on the `SkillAssessmentTemplatesOnReportTemplates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `clubId` on the `Team` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorId` on the `Team` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `TeamAffiliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamId` on the `TeamAffiliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserSubscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizationId` on the `organization_insider_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `insiderNoteId` on the `organization_insider_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizationId` on the `organization_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `noteId` on the `organization_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizationId` on the `organization_player_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `organization_player_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizationId` on the `organization_report_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reportId` on the `organization_report_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `user_insider_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `insiderNoteId` on the `user_insider_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `user_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `noteId` on the `user_note_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `user_player_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `user_player_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `user_report_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reportId` on the `user_report_access_control_list` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_countryId_fkey";

-- DropForeignKey
ALTER TABLE "AgencyAffiliation" DROP CONSTRAINT "AgencyAffiliation_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "AgencyAffiliation" DROP CONSTRAINT "AgencyAffiliation_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_ageCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_juniorLevelId_fkey";

-- DropForeignKey
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_typeId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionGroup" DROP CONSTRAINT "CompetitionGroup_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionGroupsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_groupId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionGroupsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_subscriptionI_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionGroupsOnUserSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnUserSubscriptions_groupId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionGroupsOnUserSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnUserSubscriptions_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_groupId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_teamId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionsOnOrganizationSubscriptions_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionsOnOrganizationSubscriptions_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionsOnUserSubscriptions" DROP CONSTRAINT "CompetitionsOnUserSubscriptions_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionsOnUserSubscriptions" DROP CONSTRAINT "CompetitionsOnUserSubscriptions_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "FollowAgency" DROP CONSTRAINT "FollowAgency_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "FollowAgency" DROP CONSTRAINT "FollowAgency_followerId_fkey";

-- DropForeignKey
ALTER TABLE "FollowPlayer" DROP CONSTRAINT "FollowPlayer_followerId_fkey";

-- DropForeignKey
ALTER TABLE "FollowPlayer" DROP CONSTRAINT "FollowPlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "FollowScout" DROP CONSTRAINT "FollowScout_followerId_fkey";

-- DropForeignKey
ALTER TABLE "FollowScout" DROP CONSTRAINT "FollowScout_scoutId_fkey";

-- DropForeignKey
ALTER TABLE "FollowTeam" DROP CONSTRAINT "FollowTeam_followerId_fkey";

-- DropForeignKey
ALTER TABLE "FollowTeam" DROP CONSTRAINT "FollowTeam_teamId_fkey";

-- DropForeignKey
ALTER TABLE "InsiderNote" DROP CONSTRAINT "InsiderNote_authorId_fkey";

-- DropForeignKey
ALTER TABLE "InsiderNote" DROP CONSTRAINT "InsiderNote_playerId_fkey";

-- DropForeignKey
ALTER TABLE "InsiderNoteMeta" DROP CONSTRAINT "InsiderNoteMeta_competitionGroupId_fkey";

-- DropForeignKey
ALTER TABLE "InsiderNoteMeta" DROP CONSTRAINT "InsiderNoteMeta_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "InsiderNoteMeta" DROP CONSTRAINT "InsiderNoteMeta_insiderNoteId_fkey";

-- DropForeignKey
ALTER TABLE "InsiderNoteMeta" DROP CONSTRAINT "InsiderNoteMeta_teamId_fkey";

-- DropForeignKey
ALTER TABLE "LikeInsiderNote" DROP CONSTRAINT "LikeInsiderNote_insiderNoteId_fkey";

-- DropForeignKey
ALTER TABLE "LikeInsiderNote" DROP CONSTRAINT "LikeInsiderNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikeNote" DROP CONSTRAINT "LikeNote_noteId_fkey";

-- DropForeignKey
ALTER TABLE "LikeNote" DROP CONSTRAINT "LikeNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikePlayer" DROP CONSTRAINT "LikePlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "LikePlayer" DROP CONSTRAINT "LikePlayer_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikeReport" DROP CONSTRAINT "LikeReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "LikeReport" DROP CONSTRAINT "LikeReport_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikeTeam" DROP CONSTRAINT "LikeTeam_teamId_fkey";

-- DropForeignKey
ALTER TABLE "LikeTeam" DROP CONSTRAINT "LikeTeam_userId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "MatchAttendance" DROP CONSTRAINT "MatchAttendance_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchAttendance" DROP CONSTRAINT "MatchAttendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_matchId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_playerId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_competitionGroupId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_noteId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_positionId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_matchId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_scoutId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationSubscription" DROP CONSTRAINT "OrganizationSubscription_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_primaryPositionId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_matchId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStatsMeta" DROP CONSTRAINT "PlayerStatsMeta_statsId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStatsMeta" DROP CONSTRAINT "PlayerStatsMeta_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_countryId_fkey";

-- DropForeignKey
ALTER TABLE "RegionsOnCompetitionGroups" DROP CONSTRAINT "RegionsOnCompetitionGroups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "RegionsOnCompetitionGroups" DROP CONSTRAINT "RegionsOnCompetitionGroups_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_matchId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_templateId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_competitionGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_positionId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_teamId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSkillAssessment" DROP CONSTRAINT "ReportSkillAssessment_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSkillAssessment" DROP CONSTRAINT "ReportSkillAssessment_templateId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSkillAssessmentCategory" DROP CONSTRAINT "ReportSkillAssessmentCategory_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSkillAssessmentTemplate" DROP CONSTRAINT "ReportSkillAssessmentTemplate_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSkillAssessmentTemplate" DROP CONSTRAINT "ReportSkillAssessmentTemplate_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ReportTemplate" DROP CONSTRAINT "ReportTemplate_authorId_fkey";

-- DropForeignKey
ALTER TABLE "SecondaryPositionsOnPlayers" DROP CONSTRAINT "SecondaryPositionsOnPlayers_playerId_fkey";

-- DropForeignKey
ALTER TABLE "SecondaryPositionsOnPlayers" DROP CONSTRAINT "SecondaryPositionsOnPlayers_playerPositionId_fkey";

-- DropForeignKey
ALTER TABLE "SkillAssessmentTemplatesOnReportTemplates" DROP CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_reportTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "SkillAssessmentTemplatesOnReportTemplates" DROP CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_skillAssessmentT_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_clubId_fkey";

-- DropForeignKey
ALTER TABLE "TeamAffiliation" DROP CONSTRAINT "TeamAffiliation_playerId_fkey";

-- DropForeignKey
ALTER TABLE "TeamAffiliation" DROP CONSTRAINT "TeamAffiliation_teamId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clubId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_footballRoleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_regionId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "organization_insider_note_access_control_list" DROP CONSTRAINT "organization_insider_note_access_control_list_insiderNoteI_fkey";

-- DropForeignKey
ALTER TABLE "organization_insider_note_access_control_list" DROP CONSTRAINT "organization_insider_note_access_control_list_organization_fkey";

-- DropForeignKey
ALTER TABLE "organization_note_access_control_list" DROP CONSTRAINT "organization_note_access_control_list_noteId_fkey";

-- DropForeignKey
ALTER TABLE "organization_note_access_control_list" DROP CONSTRAINT "organization_note_access_control_list_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_player_access_control_list" DROP CONSTRAINT "organization_player_access_control_list_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_player_access_control_list" DROP CONSTRAINT "organization_player_access_control_list_playerId_fkey";

-- DropForeignKey
ALTER TABLE "organization_report_access_control_list" DROP CONSTRAINT "organization_report_access_control_list_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_report_access_control_list" DROP CONSTRAINT "organization_report_access_control_list_reportId_fkey";

-- DropForeignKey
ALTER TABLE "user_insider_note_access_control_list" DROP CONSTRAINT "user_insider_note_access_control_list_insiderNoteId_fkey";

-- DropForeignKey
ALTER TABLE "user_insider_note_access_control_list" DROP CONSTRAINT "user_insider_note_access_control_list_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_note_access_control_list" DROP CONSTRAINT "user_note_access_control_list_noteId_fkey";

-- DropForeignKey
ALTER TABLE "user_note_access_control_list" DROP CONSTRAINT "user_note_access_control_list_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_player_access_control_list" DROP CONSTRAINT "user_player_access_control_list_playerId_fkey";

-- DropForeignKey
ALTER TABLE "user_player_access_control_list" DROP CONSTRAINT "user_player_access_control_list_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_report_access_control_list" DROP CONSTRAINT "user_report_access_control_list_reportId_fkey";

-- DropForeignKey
ALTER TABLE "user_report_access_control_list" DROP CONSTRAINT "user_report_access_control_list_userId_fkey";

-- AlterTable
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "countryId",
ADD COLUMN     "countryId" INTEGER NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "Agency_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AgencyAffiliation" DROP CONSTRAINT "AgencyAffiliation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "agencyId",
ADD COLUMN     "agencyId" INTEGER NOT NULL,
ADD CONSTRAINT "AgencyAffiliation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Club" DROP CONSTRAINT "Club_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "countryId",
ADD COLUMN     "countryId" INTEGER NOT NULL,
DROP COLUMN "regionId",
ADD COLUMN     "regionId" INTEGER NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "Club_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "countryId",
ADD COLUMN     "countryId" INTEGER NOT NULL,
DROP COLUMN "ageCategoryId",
ADD COLUMN     "ageCategoryId" INTEGER NOT NULL,
DROP COLUMN "typeId",
ADD COLUMN     "typeId" INTEGER NOT NULL,
DROP COLUMN "juniorLevelId",
ADD COLUMN     "juniorLevelId" INTEGER,
ADD CONSTRAINT "Competition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionAgeCategory" DROP CONSTRAINT "CompetitionAgeCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CompetitionAgeCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionGroup" DROP CONSTRAINT "CompetitionGroup_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
ADD CONSTRAINT "CompetitionGroup_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionGroupsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_pkey",
DROP COLUMN "subscriptionId",
ADD COLUMN     "subscriptionId" INTEGER NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD CONSTRAINT "CompetitionGroupsOnOrganizationSubscriptions_pkey" PRIMARY KEY ("subscriptionId", "groupId");

-- AlterTable
ALTER TABLE "CompetitionGroupsOnUserSubscriptions" DROP CONSTRAINT "CompetitionGroupsOnUserSubscriptions_pkey",
DROP COLUMN "subscriptionId",
ADD COLUMN     "subscriptionId" INTEGER NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD CONSTRAINT "CompetitionGroupsOnUserSubscriptions_pkey" PRIMARY KEY ("subscriptionId", "groupId");

-- AlterTable
ALTER TABLE "CompetitionJuniorLevel" DROP CONSTRAINT "CompetitionJuniorLevel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CompetitionJuniorLevel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_pkey",
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
DROP COLUMN "seasonId",
ADD COLUMN     "seasonId" INTEGER NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER,
ADD CONSTRAINT "CompetitionParticipation_pkey" PRIMARY KEY ("teamId", "competitionId", "seasonId");

-- AlterTable
ALTER TABLE "CompetitionType" DROP CONSTRAINT "CompetitionType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CompetitionType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompetitionsOnOrganizationSubscriptions" DROP CONSTRAINT "CompetitionsOnOrganizationSubscriptions_pkey",
DROP COLUMN "subscriptionId",
ADD COLUMN     "subscriptionId" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
ADD CONSTRAINT "CompetitionsOnOrganizationSubscriptions_pkey" PRIMARY KEY ("subscriptionId", "competitionId");

-- AlterTable
ALTER TABLE "CompetitionsOnUserSubscriptions" DROP CONSTRAINT "CompetitionsOnUserSubscriptions_pkey",
DROP COLUMN "subscriptionId",
ADD COLUMN     "subscriptionId" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
ADD CONSTRAINT "CompetitionsOnUserSubscriptions_pkey" PRIMARY KEY ("subscriptionId", "competitionId");

-- AlterTable
ALTER TABLE "Country" DROP CONSTRAINT "Country_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FollowAgency" DROP CONSTRAINT "FollowAgency_pkey",
DROP COLUMN "agencyId",
ADD COLUMN     "agencyId" INTEGER NOT NULL,
DROP COLUMN "followerId",
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD CONSTRAINT "FollowAgency_pkey" PRIMARY KEY ("agencyId", "followerId");

-- AlterTable
ALTER TABLE "FollowPlayer" DROP CONSTRAINT "FollowPlayer_pkey",
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "followerId",
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD CONSTRAINT "FollowPlayer_pkey" PRIMARY KEY ("playerId", "followerId");

-- AlterTable
ALTER TABLE "FollowScout" DROP CONSTRAINT "FollowScout_pkey",
DROP COLUMN "scoutId",
ADD COLUMN     "scoutId" INTEGER NOT NULL,
DROP COLUMN "followerId",
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD CONSTRAINT "FollowScout_pkey" PRIMARY KEY ("scoutId", "followerId");

-- AlterTable
ALTER TABLE "FollowTeam" DROP CONSTRAINT "FollowTeam_pkey",
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
DROP COLUMN "followerId",
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD CONSTRAINT "FollowTeam_pkey" PRIMARY KEY ("teamId", "followerId");

-- AlterTable
ALTER TABLE "InsiderNote" DROP CONSTRAINT "InsiderNote_pkey",
DROP COLUMN "docNumber",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "InsiderNote_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "InsiderNoteMeta" DROP CONSTRAINT "InsiderNoteMeta_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "insiderNoteId",
ADD COLUMN     "insiderNoteId" INTEGER NOT NULL,
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
DROP COLUMN "competitionGroupId",
ADD COLUMN     "competitionGroupId" INTEGER,
ADD CONSTRAINT "InsiderNoteMeta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LikeInsiderNote" DROP CONSTRAINT "LikeInsiderNote_pkey",
DROP COLUMN "insiderNoteId",
ADD COLUMN     "insiderNoteId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "LikeInsiderNote_pkey" PRIMARY KEY ("insiderNoteId", "userId");

-- AlterTable
ALTER TABLE "LikeNote" DROP CONSTRAINT "LikeNote_pkey",
DROP COLUMN "noteId",
ADD COLUMN     "noteId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "LikeNote_pkey" PRIMARY KEY ("noteId", "userId");

-- AlterTable
ALTER TABLE "LikePlayer" DROP CONSTRAINT "LikePlayer_pkey",
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "LikePlayer_pkey" PRIMARY KEY ("playerId", "userId");

-- AlterTable
ALTER TABLE "LikeReport" DROP CONSTRAINT "LikeReport_pkey",
DROP COLUMN "reportId",
ADD COLUMN     "reportId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "LikeReport_pkey" PRIMARY KEY ("reportId", "userId");

-- AlterTable
ALTER TABLE "LikeTeam" DROP CONSTRAINT "LikeTeam_pkey",
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "LikeTeam_pkey" PRIMARY KEY ("teamId", "userId");

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "homeTeamId",
ADD COLUMN     "homeTeamId" INTEGER NOT NULL,
DROP COLUMN "awayTeamId",
ADD COLUMN     "awayTeamId" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER,
DROP COLUMN "seasonId",
ADD COLUMN     "seasonId" INTEGER NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MatchAttendance" DROP CONSTRAINT "MatchAttendance_pkey",
DROP COLUMN "matchId",
ADD COLUMN     "matchId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "MatchAttendance_pkey" PRIMARY KEY ("matchId", "userId");

-- AlterTable
ALTER TABLE "Note" DROP CONSTRAINT "Note_pkey",
DROP COLUMN "docNumber",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER,
DROP COLUMN "matchId",
ADD COLUMN     "matchId" INTEGER,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "Note_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "noteId",
ADD COLUMN     "noteId" INTEGER NOT NULL,
DROP COLUMN "positionId",
ADD COLUMN     "positionId" INTEGER NOT NULL,
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
DROP COLUMN "competitionGroupId",
ADD COLUMN     "competitionGroupId" INTEGER,
ADD CONSTRAINT "NoteMeta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "docNumber",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
DROP COLUMN "scoutId",
ADD COLUMN     "scoutId" INTEGER,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER,
DROP COLUMN "matchId",
ADD COLUMN     "matchId" INTEGER,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrganizationSubscription" DROP CONSTRAINT "OrganizationSubscription_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" INTEGER NOT NULL,
ADD CONSTRAINT "OrganizationSubscription_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "countryId",
ADD COLUMN     "countryId" INTEGER NOT NULL,
DROP COLUMN "primaryPositionId",
ADD COLUMN     "primaryPositionId" INTEGER NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlayerPosition" DROP CONSTRAINT "PlayerPosition_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PlayerPosition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlayerStats" DROP CONSTRAINT "PlayerStats_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "matchId",
ADD COLUMN     "matchId" INTEGER NOT NULL,
ADD CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlayerStatsMeta" DROP CONSTRAINT "PlayerStatsMeta_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "statsId",
ADD COLUMN     "statsId" INTEGER NOT NULL,
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
ADD CONSTRAINT "PlayerStatsMeta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Region" DROP CONSTRAINT "Region_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "countryId",
ADD COLUMN     "countryId" INTEGER NOT NULL,
ADD CONSTRAINT "Region_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RegionsOnCompetitionGroups" DROP CONSTRAINT "RegionsOnCompetitionGroups_pkey",
DROP COLUMN "regionId",
ADD COLUMN     "regionId" INTEGER NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD CONSTRAINT "RegionsOnCompetitionGroups_pkey" PRIMARY KEY ("regionId", "groupId");

-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
DROP COLUMN "docNumber",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
DROP COLUMN "templateId",
ADD COLUMN     "templateId" INTEGER NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "matchId",
ADD COLUMN     "matchId" INTEGER,
DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReportBackgroundImage" DROP CONSTRAINT "ReportBackgroundImage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ReportBackgroundImage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "reportId",
ADD COLUMN     "reportId" INTEGER NOT NULL,
DROP COLUMN "positionId",
ADD COLUMN     "positionId" INTEGER NOT NULL,
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
DROP COLUMN "competitionGroupId",
ADD COLUMN     "competitionGroupId" INTEGER,
ADD CONSTRAINT "ReportMeta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReportSkillAssessment" DROP CONSTRAINT "ReportSkillAssessment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "templateId",
ADD COLUMN     "templateId" INTEGER NOT NULL,
DROP COLUMN "reportId",
ADD COLUMN     "reportId" INTEGER NOT NULL,
ADD CONSTRAINT "ReportSkillAssessment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReportSkillAssessmentCategory" DROP CONSTRAINT "ReportSkillAssessmentCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "ReportSkillAssessmentCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReportSkillAssessmentTemplate" DROP CONSTRAINT "ReportSkillAssessmentTemplate_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "ReportSkillAssessmentTemplate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReportTemplate" DROP CONSTRAINT "ReportTemplate_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Season" DROP CONSTRAINT "Season_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Season_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SecondaryPositionsOnPlayers" DROP CONSTRAINT "SecondaryPositionsOnPlayers_pkey",
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "playerPositionId",
ADD COLUMN     "playerPositionId" INTEGER NOT NULL,
ADD CONSTRAINT "SecondaryPositionsOnPlayers_pkey" PRIMARY KEY ("playerId", "playerPositionId");

-- AlterTable
ALTER TABLE "SkillAssessmentTemplatesOnReportTemplates" DROP CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_pkey",
DROP COLUMN "reportTemplateId",
ADD COLUMN     "reportTemplateId" INTEGER NOT NULL,
DROP COLUMN "skillAssessmentTemplateId",
ADD COLUMN     "skillAssessmentTemplateId" INTEGER NOT NULL,
ADD CONSTRAINT "SkillAssessmentTemplatesOnReportTemplates_pkey" PRIMARY KEY ("reportTemplateId", "skillAssessmentTemplateId");

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clubId",
ADD COLUMN     "clubId" INTEGER NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeamAffiliation" DROP CONSTRAINT "TeamAffiliation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
DROP COLUMN "teamId",
ADD COLUMN     "teamId" INTEGER NOT NULL,
ADD CONSTRAINT "TeamAffiliation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "regionId",
ADD COLUMN     "regionId" INTEGER,
DROP COLUMN "footballRoleId",
ADD COLUMN     "footballRoleId" INTEGER,
DROP COLUMN "clubId",
ADD COLUMN     "clubId" INTEGER,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" INTEGER,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserFootballRole" DROP CONSTRAINT "UserFootballRole_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserFootballRole_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "organization_insider_note_access_control_list" DROP CONSTRAINT "organization_insider_note_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" INTEGER NOT NULL,
DROP COLUMN "insiderNoteId",
ADD COLUMN     "insiderNoteId" INTEGER NOT NULL,
ADD CONSTRAINT "organization_insider_note_access_control_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "organization_note_access_control_list" DROP CONSTRAINT "organization_note_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" INTEGER NOT NULL,
DROP COLUMN "noteId",
ADD COLUMN     "noteId" INTEGER NOT NULL,
ADD CONSTRAINT "organization_note_access_control_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "organization_player_access_control_list" DROP CONSTRAINT "organization_player_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" INTEGER NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
ADD CONSTRAINT "organization_player_access_control_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "organization_report_access_control_list" DROP CONSTRAINT "organization_report_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "organizationId",
ADD COLUMN     "organizationId" INTEGER NOT NULL,
DROP COLUMN "reportId",
ADD COLUMN     "reportId" INTEGER NOT NULL,
ADD CONSTRAINT "organization_report_access_control_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_insider_note_access_control_list" DROP CONSTRAINT "user_insider_note_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "insiderNoteId",
ADD COLUMN     "insiderNoteId" INTEGER NOT NULL,
ADD CONSTRAINT "user_insider_note_access_control_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_note_access_control_list" DROP CONSTRAINT "user_note_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "noteId",
ADD COLUMN     "noteId" INTEGER NOT NULL,
ADD CONSTRAINT "user_note_access_control_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_player_access_control_list" DROP CONSTRAINT "user_player_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL,
ADD CONSTRAINT "user_player_access_control_list_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_report_access_control_list" DROP CONSTRAINT "user_report_access_control_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "reportId",
ADD COLUMN     "reportId" INTEGER NOT NULL,
ADD CONSTRAINT "user_report_access_control_list_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_level_countryId_key" ON "Competition"("level", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionGroup_name_competitionId_key" ON "CompetitionGroup"("name", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "InsiderNoteMeta_insiderNoteId_key" ON "InsiderNoteMeta"("insiderNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchAttendance_userId_isActive_key" ON "MatchAttendance"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "NoteMeta_noteId_key" ON "NoteMeta"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_matchId_key" ON "PlayerStats"("playerId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStatsMeta_statsId_key" ON "PlayerStatsMeta"("statsId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_countryId_key" ON "Region"("name", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportMeta_reportId_key" ON "ReportMeta"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_insider_note_access_control_list_organizationI_key" ON "organization_insider_note_access_control_list"("organizationId", "insiderNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_note_access_control_list_organizationId_noteId_key" ON "organization_note_access_control_list"("organizationId", "noteId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_player_access_control_list_organizationId_play_key" ON "organization_player_access_control_list"("organizationId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_report_access_control_list_organizationId_repo_key" ON "organization_report_access_control_list"("organizationId", "reportId");

-- CreateIndex
CREATE UNIQUE INDEX "user_insider_note_access_control_list_userId_insiderNoteId_key" ON "user_insider_note_access_control_list"("userId", "insiderNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "user_note_access_control_list_userId_noteId_key" ON "user_note_access_control_list"("userId", "noteId");

-- CreateIndex
CREATE UNIQUE INDEX "user_player_access_control_list_userId_playerId_key" ON "user_player_access_control_list"("userId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_report_access_control_list_userId_reportId_key" ON "user_report_access_control_list"("userId", "reportId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_footballRoleId_fkey" FOREIGN KEY ("footballRoleId") REFERENCES "UserFootballRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "LikePlayer" ADD CONSTRAINT "LikePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikePlayer" ADD CONSTRAINT "LikePlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeReport" ADD CONSTRAINT "LikeReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeReport" ADD CONSTRAINT "LikeReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeNote" ADD CONSTRAINT "LikeNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeNote" ADD CONSTRAINT "LikeNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeInsiderNote" ADD CONSTRAINT "LikeInsiderNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeInsiderNote" ADD CONSTRAINT "LikeInsiderNote_insiderNoteId_fkey" FOREIGN KEY ("insiderNoteId") REFERENCES "InsiderNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeTeam" ADD CONSTRAINT "LikeTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeTeam" ADD CONSTRAINT "LikeTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAttendance" ADD CONSTRAINT "MatchAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAttendance" ADD CONSTRAINT "MatchAttendance_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
