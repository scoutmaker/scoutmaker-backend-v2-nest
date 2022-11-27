import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum ReportBackgroundImagesSortBy {
  id = 'id',
  name = 'name',
}

export class ReportBackgroundImagesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ReportBackgroundImagesSortBy, {
    message: formatSortingEnumErrorMessage(ReportBackgroundImagesSortBy),
  })
  sortBy?: ReportBackgroundImagesSortBy;
}
