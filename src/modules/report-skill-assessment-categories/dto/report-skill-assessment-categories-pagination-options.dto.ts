import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum ReportSkillAssessmentCategoriesSortBy {
  id = 'id',
  name = 'name',
}

export class ReportSkillAssessmentCategoriesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ReportSkillAssessmentCategoriesSortBy, {
    message: formatSortingEnumErrorMessage(
      ReportSkillAssessmentCategoriesSortBy,
    ),
  })
  sortBy?: ReportSkillAssessmentCategoriesSortBy;
}
