import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

import { mapStringToNumber } from '../../../utils/helpers';

export class FindAllOrganizationSubscriptionsDto {
  @IsOptional()
  @IsString()
  @Type(() => Number)
  organizationId?: number;

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
}
