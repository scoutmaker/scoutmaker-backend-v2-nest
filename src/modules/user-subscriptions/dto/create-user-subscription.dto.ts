import { IsArray, IsDate, IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateUserSubscriptionDto {
  @IsCuid()
  userId: string;

  @IsDate()
  startDate: string;

  @IsDate()
  endDate: string;

  @IsArray()
  @IsCuid({ each: true })
  competitionIds: string[];

  @IsOptional()
  @IsArray()
  @IsCuid({ each: true })
  competitionGroupIds: string[];
}
