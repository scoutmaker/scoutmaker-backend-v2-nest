import { IsInt, Max, Min } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionJuniorLevelDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  @Min(1)
  @Max(15)
  level: number;
}
