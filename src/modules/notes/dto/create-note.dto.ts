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
  @Min(2)
  @Max(20)
  rating?: number;

  @IsOptional()
  @IsInt()
  playerId?: number;

  @IsOptional()
  @IsInt()
  matchId?: number;

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
}
