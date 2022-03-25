import { IsArray, IsDateString, IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateOrganizationSubscriptionDto {
  @IsCuid()
  organizationId: string;

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
