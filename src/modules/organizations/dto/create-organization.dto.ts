import { IsArray } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateOrganizationDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsArray()
  @IsCuid({ each: true })
  memberIds: string[];
}
