import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { NoteBasicDataDto } from '../../notes/dto/note.dto';
import { PlayerDto } from '../../players/dto/player.dto';
import { ReportDto } from '../../reports/dto/report.dto';

class organizationInfo {
  name: string;
  sharedInfo: number;
}

class DashboardReportDataDto extends PickType(ReportDto, [
  'id',
  'player',
  'match',
  'createdAt',
  'finalRating',
]) {}

class DashboardPlayerDataDto extends PickType(PlayerDto, [
  'id',
  'firstName',
  'lastName',
]) {
  averageRating: number;
}

export class DashboardDataDto {
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
  organizations?: organizationInfo[];

  @Expose()
  scouts?: number;

  @Expose()
  observerdPlayers?: number;

  @Transform(({ value }) =>
    plainToInstance(NoteBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  topNotes?: NoteBasicDataDto[];

  @Transform(({ value }) =>
    plainToInstance(DashboardReportDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  topReports?: DashboardReportDataDto[];

  @Transform(({ value }) =>
    plainToInstance(DashboardPlayerDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  topPlayers?: DashboardPlayerDataDto[];
}
