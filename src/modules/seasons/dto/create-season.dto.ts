import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSeasonDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive = false;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
