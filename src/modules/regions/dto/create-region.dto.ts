import { IsInt } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateRegionDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  countryId: number;
}
