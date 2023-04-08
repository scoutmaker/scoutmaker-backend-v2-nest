import { PickType } from '@nestjs/swagger';
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

export class FindAllNotesDto {
  @IsOptionalStringArray()
  playerIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsString({ each: true })
  positionIds?: string[];

  @IsOptionalStringArray()
  positionTypeIds?: string[];

  @IsOptionalStringArray()
  teamIds?: string[];

  @IsOptionalStringArray()
  matchIds?: string[];

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
  onlyWithoutPlayers?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyMine?: boolean;
}

export class GetNotesListDto extends PickType(FindAllNotesDto, ['matchIds']) {}
