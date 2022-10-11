import { IsOptional, IsString } from 'class-validator';

import { IsOptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';

export class FindAllCompetitionGroupsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptionalStringArray()
  competitionIds?: string[];

  @IsOptionalStringArray()
  regionIds?: string[];
}
