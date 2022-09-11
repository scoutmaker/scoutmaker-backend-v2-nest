import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  id?: string;

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
  @IsString()
  playerId?: string;

  @IsOptional()
  @IsString()
  matchId?: string;

  @IsOptional()
  @IsString()
  positionPlayedId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsString()
  competitionId?: string;

  @IsOptional()
  @IsString()
  competitionGroupId?: string;
}
