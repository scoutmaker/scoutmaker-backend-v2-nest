import { IsArray } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionGroupDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsCuid()
  competitionId: string;

  @IsArray()
  @IsCuid({ each: true })
  regionIds: string[];
}
