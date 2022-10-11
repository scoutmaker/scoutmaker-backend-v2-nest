import { IsOptional, IsString } from 'class-validator';

import { IsOptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';

export class FindAllReportSkillAssessmentTemplatesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptionalStringArray()
  categoryIds?: string[];
}
