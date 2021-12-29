import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @MaxLength(2)
  code: string;

  @IsOptional()
  @IsBooleanString()
  isEuMember?: boolean = false;
}
