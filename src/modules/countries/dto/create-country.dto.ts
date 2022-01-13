import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  @MaxLength(30)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNotEmpty()
  @MaxLength(2)
  @Transform(({ value }) => value.trim().toLowerCase())
  code: string;

  @IsOptional()
  @IsBoolean()
  isEuMember?: boolean = false;
}
