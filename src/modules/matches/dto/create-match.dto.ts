import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsUrl, Min } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateMatchDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  homeGoals?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  awayGoals?: number;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsCuid()
  homeTeamId: string;

  @IsCuid()
  awayTeamId: string;

  @IsCuid()
  competitionId: string;

  @IsOptional()
  @IsCuid()
  groupId?: string;

  @IsCuid()
  seasonId: string;
}
