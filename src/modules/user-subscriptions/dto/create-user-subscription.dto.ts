import { IsArray, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateUserSubscriptionDto {
  @IsInt()
  userId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsInt({ each: true })
  competitionIds: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  competitionGroupIds: string[];
}
