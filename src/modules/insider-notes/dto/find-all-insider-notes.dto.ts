import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllInsiderNotesDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  playerIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  positionIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  teamIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  competitionIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  competitionGroupIds?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isLiked?: boolean;
}
