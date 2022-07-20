import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllAgenciesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  countryId?: number;
}
