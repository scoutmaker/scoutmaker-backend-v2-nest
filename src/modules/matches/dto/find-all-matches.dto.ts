import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional } from 'class-validator';

import { mapStringToNumber } from '../../../utils/helpers';

export class FindAllMatchesDto {
  @IsOptional()
  @IsInt()
  teamId?: number;

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  competitionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  groupIds?: number[];

  @IsOptional()
  @IsInt()
  seasonId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orderId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  hasVideo?: boolean;
}
