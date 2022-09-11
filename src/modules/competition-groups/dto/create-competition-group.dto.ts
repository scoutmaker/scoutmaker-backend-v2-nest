import { IsArray, IsInt } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionGroupDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  competitionId: number;

  @IsArray()
  @IsCuid({ each: true })
  regionIds: string[];
}
