import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UserPlayerAceSortBy {
  id = 'id',
  user = 'user',
  report = 'report',
  createdAt = 'createdAt',
}

export class UserReportAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UserPlayerAceSortBy, {
    message: formatSortingEnumErrorMessage(UserPlayerAceSortBy),
  })
  sortBy?: UserPlayerAceSortBy;
}
