import { Transform } from 'class-transformer';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreatePlayerPositionDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsRequiredStringWithMaxLength(10)
  @Transform(({ value }) => value.trim().toUpperCase())
  code: string;
}
