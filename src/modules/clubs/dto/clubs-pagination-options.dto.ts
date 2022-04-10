import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum ClubsSortBy {
  id = 'id',
  name = 'name',
  countryId = 'countryId',
  regionId = 'regionId',
}

export class ClubsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ClubsSortBy, {
    message: formatSortingEnumErrorMessage(ClubsSortBy),
  })
  sortBy?: ClubsSortBy;
}
