import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllCompetitionsDto {
  @IsOptional()
  @IsString()
  countryId?: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isJunior?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isWomen?: boolean;
}
