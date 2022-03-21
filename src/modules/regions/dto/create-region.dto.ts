import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateRegionDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsCuid()
  countryId: string;
}
