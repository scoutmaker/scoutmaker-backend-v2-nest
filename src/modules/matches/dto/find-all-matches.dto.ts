import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class FindAllMatchesDto {
  @IsOptional()
  @IsInt()
  teamId?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  competitionIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  groupIds?: string[];

  @IsOptional()
  @IsInt()
  seasonId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orderId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  hasVideo?: boolean;
}
