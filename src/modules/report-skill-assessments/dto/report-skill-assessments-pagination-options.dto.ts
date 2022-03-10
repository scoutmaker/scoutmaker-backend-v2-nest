import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum ReportSkillAssessmentsSortBy {
  id = 'id',
  rating = 'rating',
  player = 'player',
  match = 'match',
}

export class ReportSkillAssessmentsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ReportSkillAssessmentsSortBy, {
    message: formatSortingEnumErrorMessage(ReportSkillAssessmentsSortBy),
  })
  sortBy?: ReportSkillAssessmentsSortBy;
}
