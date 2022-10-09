import { IsOptional, IsString } from 'class-validator';

import { OptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';

export class FindAllCompetitionGroupsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @OptionalStringArray()
  competitionIds?: string[];

  @OptionalStringArray()
  regionIds?: string[];
}
