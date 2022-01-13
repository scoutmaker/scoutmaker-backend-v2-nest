import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  countryId: string;
}
