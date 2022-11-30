import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { NoteDto } from '../../notes/dto/note.dto';
import { OrganizationBasicDataDto } from '../../organizations/dto/organization.dto';
import { PlayerSuperBasicDataDto } from '../../players/dto/player.dto';
import { ReportDto } from '../../reports/dto/report.dto';
import { UserDto } from '../../users/dto/user.dto';

class DashboardReportDto extends PickType(ReportDto, [
  'id',
  'player',
  'createdAt',
  'finalRating',
  'match',
  'docNumber',
]) {}

class DashboardPlayerDto extends PlayerSuperBasicDataDto {
  @Expose()
  averageRating: number;
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

export class UserDashboardDto extends PickType(UserDto, ['id', 'role']) {
  @Expose()
  organizationId: string;
}

export class DashboardDto {
  @Transform(({ value }) =>
    plainToInstance(UserDashboardDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserDashboardDto;

  @Expose()
  reportsCount?: number;

  @Expose()
  recentReportsRatio?: number;

  @Expose()
  notesCount?: number;

  @Expose()
  recentNotesRatio?: number;

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
