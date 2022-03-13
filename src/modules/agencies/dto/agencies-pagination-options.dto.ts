import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum AgenciesSortBy {
  id = 'id',
  name = 'name',
  country = 'country',
}

export class AgenciesPaginationOptions extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(AgenciesSortBy, {
    message: formatSortingEnumErrorMessage(AgenciesSortBy),
  })
  sortBy?: AgenciesSortBy;
}
