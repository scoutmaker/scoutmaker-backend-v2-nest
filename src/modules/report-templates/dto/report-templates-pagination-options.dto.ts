import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum ReportTemplatesSortBy {
  id = 'id',
  name = 'name',
}

export class ReportTemplatesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ReportTemplatesSortBy, {
    message: formatSortingEnumErrorMessage(ReportTemplatesSortBy),
  })
  sortBy?: ReportTemplatesSortBy;
}
