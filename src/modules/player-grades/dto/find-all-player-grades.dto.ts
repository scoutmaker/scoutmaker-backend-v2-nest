import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { IsOptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';
import { PlayerGradeLevelEnum } from '../types';

export class FindAllPlayerGradesDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsEnum(PlayerGradeLevelEnum, {
    message: `Grades must be a valid enum value. Available values: ${Object.keys(
      PlayerGradeLevelEnum,
    ).join(', ')}`,
    each: true,
  })
  grades?: PlayerGradeLevelEnum[];

  @IsOptionalStringArray()
  competitionIds?: string[];

  @IsOptionalStringArray()
  playerIds?: string[];
}
