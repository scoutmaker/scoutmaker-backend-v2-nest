import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum OrganizationSubscriptionsSortBy {
  id = 'id',
  organization = 'organization',
  startDate = 'startDate',
  endDate = 'endDate',
}

export class OrganizationSubscriptionsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(OrganizationSubscriptionsSortBy, {
    message: formatSortingEnumErrorMessage(OrganizationSubscriptionsSortBy),
  })
  sortBy?: OrganizationSubscriptionsSortBy;
}
