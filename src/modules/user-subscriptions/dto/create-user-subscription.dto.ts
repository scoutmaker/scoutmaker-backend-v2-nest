import { IsArray, IsDateString, IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateUserSubscriptionDto {
  @IsCuid()
  userId: string;

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
