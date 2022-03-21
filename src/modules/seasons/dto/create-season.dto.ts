import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateSeasonDto {
  @IsRequiredStringWithMaxLength(20)
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
