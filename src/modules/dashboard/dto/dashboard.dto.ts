import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { NoteDto } from '../../notes/dto/note.dto';
import {
  PlayerDto,
  PlayerSuperBasicDataDto,
} from '../../players/dto/player.dto';
import { ReportDto } from '../../reports/dto/report.dto';

class organizationInfo {
  name: string;
  sharedInfo: number;
}

class DashboardReportDataDto extends PickType(ReportDto, [
  'id',
  'player',
  'createdAt',
  'finalRating',
  'match',
]) {}

class DashboardPlayerDataDto extends PickType(PlayerDto, [
  'id',
  'firstName',
  'lastName',
]) {
  averageRating: number;
}

class DashboardNoteDataDto extends PickType(NoteDto, [
  'id',
  'docNumber',
  'description',
  'rating',
  'createdAt',
  'shirtNo',
]) {
  player?: PlayerSuperBasicDataDto;
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
    plainToInstance(DashboardNoteDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  topNotes?: DashboardNoteDataDto[];

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
