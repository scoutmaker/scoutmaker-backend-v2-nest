import { PickType } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import { PlayerBasicDataDto } from '../../players/dto/player.dto';
import { ReportSkillAssessmentBasicDataDto } from '../../report-skill-assessments/dto/report-skill-assessment.dto';
import { ReportTemplateBasicDataDto } from '../../report-templates/dto/report-template.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class ReportDto {
  @Expose()
  id: string;

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

  @Transform(({ value }) =>
    plainToInstance(ReportTemplateBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  template: ReportTemplateBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(PlayerPositionDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  positionPlayed?: PlayerPositionDto;

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

  @Transform(({ value }) => {
    console.log({ value });
    const transformed = plainToInstance(
      ReportSkillAssessmentBasicDataDto,
      value,
      {
        excludeExtraneousValues: true,
      },
    );
    console.log({ transformed });
    console.log(transformed[0].template);
    return transformed;
  })
  @Expose()
  skills: ReportSkillAssessmentBasicDataDto[];
}

export class ReportBasicDataDto extends PickType(ReportDto, [
  'id',
  'docNumber',
  'status',
  'player',
  'author',
]) {}
