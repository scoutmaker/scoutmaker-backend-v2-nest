import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum ReportSkillAssessmentTemplatesSortBy {
  id = 'id',
  name = 'name',
  category = 'category',
}

export class ReportSkillAssessmentTemplatesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ReportSkillAssessmentTemplatesSortBy, {
    message: formatSortingEnumErrorMessage(
      ReportSkillAssessmentTemplatesSortBy,
    ),
  })
  sortBy?: ReportSkillAssessmentTemplatesSortBy;
}
