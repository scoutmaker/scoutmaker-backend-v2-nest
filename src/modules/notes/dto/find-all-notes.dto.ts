import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllNotesDto {
  @IsOptional()
  @IsCuid()
  playerId?: string;

  @IsOptional()
  @IsCuid()
  positionId?: string;

  @IsOptional()
  @IsCuid()
  teamId?: string;

  @IsOptional()
  @IsCuid()
  matchId?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  competitionIds?: string[];

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
}

export class GetNotesListDto extends PickType(FindAllNotesDto, ['matchId']) {}
