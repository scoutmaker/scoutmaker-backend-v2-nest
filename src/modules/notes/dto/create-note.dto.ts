import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateNoteDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  shirtNo?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(20)
  maxRatingScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  rating?: number;

  @IsOptional()
  @IsCuid()
  playerId?: string;

  @IsOptional()
  @IsCuid()
  matchId?: string;

  @IsOptional()
  @IsCuid()
  positionPlayedId?: string;

  @IsOptional()
  @IsCuid()
  teamId?: string;

  @IsOptional()
  @IsCuid()
  competitionId?: string;

  @IsOptional()
  @IsCuid()
  competitionGroupId?: string;
}
