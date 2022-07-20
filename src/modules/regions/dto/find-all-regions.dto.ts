import { IsOptional, IsString } from 'class-validator';

export class FindAllRegionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  countryId?: number;
}
