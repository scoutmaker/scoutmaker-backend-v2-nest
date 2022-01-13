import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSeasonDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: string;
}
