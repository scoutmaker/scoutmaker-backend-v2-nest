import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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
  @IsInt()
  playerId?: string;

  @IsOptional()
  @IsInt()
  matchId?: string;

  @IsOptional()
  @IsInt()
  positionPlayedId?: string;

  @IsOptional()
  @IsInt()
  teamId?: string;

  @IsOptional()
  @IsInt()
  competitionId?: string;

  @IsOptional()
  @IsInt()
  competitionGroupId?: string;
}
