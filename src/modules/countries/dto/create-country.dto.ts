import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCountryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNotEmpty()
  @MaxLength(3)
  @Transform(({ value }) => value.trim().toLowerCase())
  code: string;

  @IsOptional()
  @IsBoolean()
  isEuMember?: boolean = false;
}
