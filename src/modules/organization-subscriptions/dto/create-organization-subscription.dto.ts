import { IsArray, IsDateString, IsInt, IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateOrganizationSubscriptionDto {
  @IsInt()
  organizationId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsCuid({ each: true })
  competitionIds: string[];

  @IsOptional()
  @IsArray()
  @IsCuid({ each: true })
  competitionGroupIds: string[];
}
