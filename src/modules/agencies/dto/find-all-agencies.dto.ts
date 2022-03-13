import { IsOptional, IsString } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllAgenciesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsCuid()
  countryId?: string;
}
