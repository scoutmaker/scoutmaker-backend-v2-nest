import { IsOptional, IsString } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionTypeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(30)
  name: string;
}
