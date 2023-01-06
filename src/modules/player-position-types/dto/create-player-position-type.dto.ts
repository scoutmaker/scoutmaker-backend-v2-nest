import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreatePlayerPositionTypeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsRequiredStringWithMaxLength(10)
  @Transform(({ value }) => value.trim().toUpperCase())
  code: string;
}
