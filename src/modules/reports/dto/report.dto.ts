import { ApiProperty, PickType } from '@nestjs/swagger';
import { ObservationType, ReportStatus } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { LikeReportBasicDataDto } from '../../like-reports/dto/like-report.dto';
import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import { PlayerBasicDataDto } from '../../players/dto/player.dto';
import { ReportSkillAssessmentBasicDataDto } from '../../report-skill-assessments/dto/report-skill-assessment.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class ReportMetaDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(TeamBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  team: TeamBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(PlayerPositionDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  position: PlayerPositionDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competition: CompetitionBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionGroupBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competitionGroup: CompetitionGroupBasicDataDto;
}

export class ReportMetaBasicDataDto extends PickType(ReportMetaDto, [
  'id',
  'team',
  'position',
]) {}

export class ReportDto {
  @Expose()
  id: string;

  @Expose()
  docNumber: number;

  @Expose()
  maxRatingScore: number;

  @Expose()
  shirtNo?: number;

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
  skillsOrder?: string[];

  @Expose()
  compactCategoriesIds?: string[];

  @Expose()
  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;

  @Expose()
  createdAt: Date;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerBasicDataDto;

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

  @Expose()
  @ApiProperty({ enum: ObservationType })
  observationType: ObservationType;

  @Transform(({ value }) =>
    plainToInstance(ReportMetaDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  meta?: ReportMetaDto;
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
  'match',
  'videoDescription',
  'summary',
  'observationType',
]) {
  @Transform(({ value }) =>
    plainToInstance(ReportMetaBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  meta?: ReportMetaBasicDataDto;
}

export class ReportBasicDataDto extends PickType(ReportDto, [
  'id',
  'docNumber',
  'status',
  'player',
  'author',
  'observationType',
]) {}

export class ReportSuperBasicDataDto extends PickType(ReportDto, [
  'id',
  'docNumber',
  'createdAt',
]) {}
