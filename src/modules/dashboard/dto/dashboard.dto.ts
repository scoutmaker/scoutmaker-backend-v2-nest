import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { NoteDto } from '../../notes/dto/note.dto';
import { PlayerSuperBasicDataDto } from '../../players/dto/player.dto';
import { ReportDto } from '../../reports/dto/report.dto';

class OrganizationInfoDto {
  name: string;
  sharedInfo: number;
}

class DashboardReportDto extends PickType(ReportDto, [
  'id',
  'player',
  'createdAt',
  'finalRating',
  'match',
]) {}

class DashboardPlayerDto extends PlayerSuperBasicDataDto {
  averageRating: number;
}

class DashboardNoteDto extends PickType(NoteDto, [
  'id',
  'docNumber',
  'description',
  'rating',
  'createdAt',
  'shirtNo',
]) {
  player?: PlayerSuperBasicDataDto;
}

export class DashboardDto {
  @Expose()
  reports?: number;

  @Expose()
  reportsRatio?: number;

  @Expose()
  notes?: number;

  @Expose()
  notesRatio?: number;

  @Expose()
  observedMatches?: number;

  @Expose()
  observedMatchesRatio?: number;

  @Expose()
  organizations?: OrganizationInfoDto[];

  @Expose()
  scouts?: number;

  @Expose()
  observerdPlayers?: number;

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
