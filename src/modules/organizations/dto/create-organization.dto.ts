import { IsArray, IsString } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateOrganizationDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsArray()
  @IsString({ each: true })
  memberIds: string[];
}
