import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

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
}

export class GetNotesListDto extends PickType(FindAllNotesDto, ['matchId']) {}
