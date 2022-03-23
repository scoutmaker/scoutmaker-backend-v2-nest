import { IsBoolean, IsOptional, IsUrl } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateReportBackgroundImageDto {
  @IsRequiredStringWithMaxLength(20)
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;
}
