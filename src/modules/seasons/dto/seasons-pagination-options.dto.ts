import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum SeasonsSortBy {
  id = 'id',
  name = 'name',
  isActive = 'isActive',
  startDate = 'startDate',
  endDate = 'endDate',
}

export class SeasonsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(SeasonsSortBy, {
    message: formatSortingEnumErrorMessage(SeasonsSortBy),
  })
  sortBy?: SeasonsSortBy;
}
