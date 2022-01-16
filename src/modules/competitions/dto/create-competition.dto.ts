import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCompetitionDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(30)
  group?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(30)
  countryId: string;

  @ArrayNotEmpty()
  @IsString({ each: true })
  regionsIds: string[];

  @IsOptional()
  @IsBoolean()
  isJunior?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isWomen?: boolean = false;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(30)
  juniorLevel?: string;
}
