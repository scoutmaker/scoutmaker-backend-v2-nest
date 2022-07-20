import { PickType } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { LikeReportBasicDataDto } from '../../like-reports/dto/like-report.dto';
import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerSuperBasicDataDto } from '../../players/dto/player.dto';
import { ReportSkillAssessmentBasicDataDto } from '../../report-skill-assessments/dto/report-skill-assessment.dto';
import { ReportTemplateBasicDataDto } from '../../report-templates/dto/report-template.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  docNumber: number;

  @Expose()
  minutesPlayed?: number;

  @Expose()
  goals?: number;

  @Expose()
  assists?: number;

  @Expose()
  yellowCards?: number;

  @Expose()
  redCards?: number;

  @Expose()
  videoUrl?: string;

  @Expose()
  videoDescription?: string;

  @Expose()
  finalRating?: number;

  @Expose()
  summary?: string;

  @Expose()
  avgRating?: number;

  @Expose()
  percentageRating?: number;

  @Expose()
  status: ReportStatus;

  @Expose()
  createdAt: Date;

  @Transform(({ value }) =>
    plainToInstance(ReportTemplateBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  template: ReportTemplateBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerSuperBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(MatchBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match?: MatchBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  author: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(ReportSkillAssessmentBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  skills: ReportSkillAssessmentBasicDataDto[];

  @Transform(({ value }) =>
    plainToInstance(LikeReportBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  likes: LikeReportBasicDataDto[];
}

export class ReportPaginatedDataDto extends PickType(ReportDto, [
  'id',
  'docNumber',
  'player',
  'finalRating',
  'percentageRating',
  'videoUrl',
  'author',
  'createdAt',
  'status',
  'likes',
]) {}

export class ReportBasicDataDto extends PickType(ReportDto, [
  'id',
  'docNumber',
  'status',
  'player',
  'author',
]) {}

export class ReportSuperBasicDataDto extends PickType(ReportDto, [
  'id',
  'docNumber',
  'createdAt',
]) {}
