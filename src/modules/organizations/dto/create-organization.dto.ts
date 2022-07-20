import { IsArray, IsInt } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateOrganizationDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsArray()
  @IsInt({ each: true })
  memberIds: number[];
}
