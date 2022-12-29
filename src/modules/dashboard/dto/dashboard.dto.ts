import { OmitType, PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MatchDto } from '../../matches/dto/match.dto';
import { NoteDto } from '../../notes/dto/note.dto';
import { OrganizationBasicDataDto } from '../../organizations/dto/organization.dto';
import {
  PlayerDto,
  PlayerSuperBasicDataDto,
} from '../../players/dto/player.dto';
import { ReportDto } from '../../reports/dto/report.dto';
import { TeamAffiliationWithoutPlayerDto } from '../../team-affiliations/dto/team-affiliation.dto';
import { TeamDto } from '../../teams/dto/team.dto';

class DashboardTeamAffiliationDto extends OmitType(
  TeamAffiliationWithoutPlayerDto,
  ['team'],
) {
  @Expose()
  team: TeamDto;
}
class DashboardMatchDto extends PickType(MatchDto, [
  'id',
  'date',
  'homeTeam',
  'awayTeam',
]) {}

class DashboardReportDto extends PickType(ReportDto, [
  'id',
  'player',
  'createdAt',
  'finalRating',
  'docNumber',
]) {
  @Transform(({ value }) =>
    plainToInstance(DashboardMatchDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match: DashboardMatchDto;
}

export class DashboardPlayerDto extends OmitType(PlayerDto, ['teams']) {
  @Expose()
  averagePrecentageRating: number;

  @Transform(({ value }) =>
    plainToInstance(DashboardTeamAffiliationDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  teams: DashboardTeamAffiliationDto[];
}

class DashboardNoteDto extends PickType(NoteDto, [
  'id',
  'docNumber',
  'description',
  'rating',
  'createdAt',
  'shirtNo',
  'match',
]) {
  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player?: PlayerSuperBasicDataDto;
}

export class DashboardDto {
  @Expose()
  reportsCount?: number;

  @Expose()
  recentReportsRatio?: number;

  @Expose()
  notesCount?: number;

  @Expose()
  recentNotesRatio?: number;

  @Expose()
  matchesCount?: number;

  @Expose()
  observedMatchesCount?: number;

  @Expose()
  recentObservedMatchesRatio?: number;

  @Transform(({ value }) =>
    plainToInstance(OrganizationBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  organizations?: OrganizationBasicDataDto[];

  @Expose()
  scoutsCount?: number;

  @Expose()
  observerdPlayersCount?: number;

  @Transform(({ value }) =>
    plainToInstance(DashboardNoteDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  topNotes?: DashboardNoteDto[];

  @Transform(({ value }) =>
    plainToInstance(DashboardReportDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  topReports?: DashboardReportDto[];

  @Transform(({ value }) =>
    plainToInstance(DashboardPlayerDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  topPlayers?: DashboardPlayerDto[];
}
