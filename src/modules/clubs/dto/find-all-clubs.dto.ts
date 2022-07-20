import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllClubsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  regionId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  countryId?: number;
}
