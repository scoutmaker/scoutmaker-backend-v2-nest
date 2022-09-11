import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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

  @IsString()
  playerId: string;

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
