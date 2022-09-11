import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateReportBackgroundImageDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(20)
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;
}
