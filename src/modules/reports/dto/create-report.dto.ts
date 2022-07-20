import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateReportSkillAssessmentDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  rating?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;

  @IsInt()
  templateId: number;
}

export class CreateReportDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  shirtNo?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  minutesPlayed?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goals?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  assists?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  yellowCards?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  redCards?: number;

  @IsOptional()
  @IsUrl()
  @Transform(({ value }) => value.trim())
  videoUrl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  videoDescription?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  finalRating?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  summary?: string;

  @IsInt()
  templateId: number;

  @IsInt()
  playerId: number;

  @IsOptional()
  @IsInt()
  positionPlayedId?: number;

  @IsOptional()
  @IsInt()
  teamId?: number;

  @IsOptional()
  @IsInt()
  competitionId?: number;

  @IsOptional()
  @IsInt()
  competitionGroupId?: number;

  @IsOptional()
  @IsInt()
  matchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportSkillAssessmentDto)
  skillAssessments?: CreateReportSkillAssessmentDto[];
}
