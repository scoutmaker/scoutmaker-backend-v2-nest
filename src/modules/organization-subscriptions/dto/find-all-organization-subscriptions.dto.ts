import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllOrganizationSubscriptionsDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

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
}
