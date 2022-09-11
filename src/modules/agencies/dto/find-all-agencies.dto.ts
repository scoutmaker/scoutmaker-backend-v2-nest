import { IsOptional, IsString } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllAgenciesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsCuid()
  countryId?: string;
}
