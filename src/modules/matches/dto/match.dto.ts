import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionGroupBasicDataDto } from '../../competition-groups/dto/competition-group.dto';
import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { SeasonBasicDataDto } from '../../seasons/dto/season.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';

export class MatchDto {
  @Expose()
  id: string;

  @Expose()
  date: Date;

  @Expose()
  homeGoals?: number;

  @Expose()
  awayGoals?: number;

  @Expose()
  videoUrl?: string;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(TeamBasicDataDto, value, { excludeExtraneousValues: true }),
  )
  homeTeam: TeamBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(TeamBasicDataDto, value, { excludeExtraneousValues: true }),
  )
  awayTeam: TeamBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  competition: CompetitionBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionGroupBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  group?: CompetitionGroupBasicDataDto;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(SeasonBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  season: SeasonBasicDataDto;
}
