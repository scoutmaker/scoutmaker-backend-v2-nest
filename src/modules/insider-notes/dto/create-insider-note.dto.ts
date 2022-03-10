import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

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

  @IsCuid()
  playerId: string;
}