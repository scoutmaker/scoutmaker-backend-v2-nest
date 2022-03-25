import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UserSubsptionsSortBy {
  id = 'id',
  user = 'user',
  startDate = 'startDate',
  endDate = 'endDate',
}

export class UserSubscriptionsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UserSubsptionsSortBy, {
    message: formatSortingEnumErrorMessage(UserSubsptionsSortBy),
  })
  sortBy?: UserSubsptionsSortBy;
}
