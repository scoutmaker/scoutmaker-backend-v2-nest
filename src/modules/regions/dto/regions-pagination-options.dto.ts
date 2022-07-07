import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum RegionsSortBy {
  id = 'id',
  name = 'name',
  countryId = 'countryId',
}

export class RegionsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(RegionsSortBy, {
    message: formatSortingEnumErrorMessage(RegionsSortBy),
  })
  sortBy?: RegionsSortBy;
}
