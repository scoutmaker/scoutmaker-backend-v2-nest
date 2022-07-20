import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class FindAllMatchesDto {
  @IsOptional()
  @IsInt()
  teamId?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  competitionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  groupIds?: number[];

  @IsOptional()
  @IsInt()
  seasonId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  hasVideo?: boolean;
}
