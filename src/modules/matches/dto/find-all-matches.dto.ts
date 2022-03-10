import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllMatchesDto {
  @IsOptional()
  @IsCuid()
  teamId?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  competitionIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsCuid({ each: true })
  groupIds?: string[];

  @IsOptional()
  @IsCuid()
  seasonId?: string;
}