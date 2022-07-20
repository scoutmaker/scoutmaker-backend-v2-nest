import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllUserSubscriptionsDto {
  @IsOptional()
  @IsString()
  userId?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  competitionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  competitionGroupIds?: number[];
}
