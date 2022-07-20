import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsUrl, Min } from 'class-validator';

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

  @IsInt()
  homeTeamId: number;

  @IsInt()
  awayTeamId: number;

  @IsInt()
  competitionId: number;

  @IsOptional()
  @IsInt()
  groupId?: string;

  @IsInt()
  seasonId: number;
}
