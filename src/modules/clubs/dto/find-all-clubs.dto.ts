import { IsOptional, IsString } from 'class-validator';

export class FindAllClubsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  regionId?: number;

  @IsOptional()
  @IsString()
  countryId?: number;
}
