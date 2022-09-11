import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInsiderNoteDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(30)
  informant?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;

  @IsInt()
  playerId: number;

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
