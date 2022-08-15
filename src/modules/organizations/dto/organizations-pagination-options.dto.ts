import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum OrganizationsSortBy {
  id = 'id',
  name = 'name',
  createdAt = 'createdAt',
}

export class OrganizationsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(OrganizationsSortBy, {
    message: formatSortingEnumErrorMessage(OrganizationsSortBy),
  })
  sortBy?: OrganizationsSortBy;
}
