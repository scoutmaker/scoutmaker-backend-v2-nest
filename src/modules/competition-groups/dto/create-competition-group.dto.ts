import { IsArray, IsInt } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionGroupDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  competitionId: number;

  @IsArray()
  @IsInt({ each: true })
  regionIds: number[];
}
