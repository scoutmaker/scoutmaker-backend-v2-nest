import { IsOptional, IsString } from 'class-validator';

import { OptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';

export class FindAllReportSkillAssessmentTemplatesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @OptionalStringArray()
  categoryIds?: string[];
}
