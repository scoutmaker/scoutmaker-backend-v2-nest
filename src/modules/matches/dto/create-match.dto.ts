import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateMatchDto {
  @IsOptional()
  @IsString()
  id?: string;

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

  @IsString()
  homeTeamId: string;

  @IsString()
  awayTeamId: string;

  @IsString()
  competitionId: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsString()
  seasonId: string;

  @IsOptional()
  @IsString()
  transfermarktUrl?: string;
}
