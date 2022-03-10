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

import { IsCuid } from '../../../decorators/is-cuid.decorator';

class CreateReportSkillAssessmentDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  rating?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;

  @IsCuid()
  templateId: string;
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

  @IsCuid()
  templateId: string;

  @IsCuid()
  playerId: string;

  @IsOptional()
  @IsCuid()
  positionPlayedId?: string;

  @IsOptional()
  @IsCuid()
  matchId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportSkillAssessmentDto)
  skillAssessments?: CreateReportSkillAssessmentDto[];
}
