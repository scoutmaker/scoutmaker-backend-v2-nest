import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UserSubscriptionsSortBy {
  id = 'id',
  user = 'user',
  startDate = 'startDate',
  endDate = 'endDate',
}

export class UserSubscriptionsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UserSubscriptionsSortBy, {
    message: formatSortingEnumErrorMessage(UserSubscriptionsSortBy),
  })
  sortBy?: UserSubscriptionsSortBy;
}
