import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { mapStringToNumber } from '../../../utils/helpers';

export class FindAllTeamsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  clubId?: number;

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  regionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  countryIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  competitionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  competitionGroupIds?: number[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isLiked?: boolean;
}
