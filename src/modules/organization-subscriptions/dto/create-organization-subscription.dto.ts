import { IsArray, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateOrganizationSubscriptionDto {
  @IsInt()
  organizationId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsInt({ each: true })
  competitionIds: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  competitionGroupIds: number[];
}
