import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationSubscriptionDto {
  @IsString()
  organizationId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  competitionIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competitionGroupIds: string[];
}
