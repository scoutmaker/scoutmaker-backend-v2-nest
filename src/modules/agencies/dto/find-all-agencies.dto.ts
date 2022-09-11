import { IsOptional, IsString } from 'class-validator';

export class FindAllAgenciesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  countryId?: string;
}
