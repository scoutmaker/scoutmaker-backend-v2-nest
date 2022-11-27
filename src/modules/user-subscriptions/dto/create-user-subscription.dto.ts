import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateUserSubscriptionDto {
  @IsString()
  userId: string;

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
