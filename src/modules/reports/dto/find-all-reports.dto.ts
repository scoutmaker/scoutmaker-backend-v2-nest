import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IsOptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';
import { ObservationTypeEnum, RatingRangesEnum } from '../../../types/common';

export class FindAllReportsDto {
  @IsOptionalStringArray()
  playerIds?: string[];

  @IsOptionalStringArray()
  positionIds?: string[];

  @IsOptionalStringArray()
  positionTypeIds?: string[];

  @IsOptionalStringArray()
  matchIds?: string[];

  @IsOptionalStringArray()
  teamIds?: string[];

  @IsOptionalStringArray()
  competitionIds?: string[];

  @IsOptionalStringArray()
  competitionGroupIds?: string[];

  @IsOptionalStringArray()
  seasonIds?: string[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @Max(100)
  percentageRatingRangeStart?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @Max(100)
  percentageRatingRangeEnd?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsEnum(RatingRangesEnum, {
    message: `Percentage rating ranges must be a valid enum value. Available values: ${Object.keys(
      RatingRangesEnum,
    ).join(', ')}`,
    each: true,
  })
  percentageRatingRanges?: RatingRangesEnum[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1950)
  @Max(2050)
  playerBornAfter?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1950)
  @Max(2050)
  playerBornBefore?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  hasVideo?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isLiked?: boolean;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(ObservationTypeEnum, {
    message: `Observation type must be a valid enum value. Available values: ${Object.keys(
      ObservationTypeEnum,
    ).join(', ')}`,
  })
  observationType?: ObservationTypeEnum;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyLikedTeams?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyLikedPlayers?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyMine?: boolean;
}
