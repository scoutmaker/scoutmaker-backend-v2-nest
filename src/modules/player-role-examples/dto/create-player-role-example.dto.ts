import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreatePlayerRoleExampleDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(30)
  player: string;

  @IsRequiredStringWithMaxLength(30)
  @Transform(({ value }) => value.trim().toUpperCase())
  type: string;

  @IsString()
  roleId: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
