import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionJuniorLevelDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  @Min(1)
  @Max(15)
  level: number;
}
