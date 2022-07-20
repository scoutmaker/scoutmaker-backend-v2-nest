import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateRegionDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsCuid()
  countryId: number;
}
