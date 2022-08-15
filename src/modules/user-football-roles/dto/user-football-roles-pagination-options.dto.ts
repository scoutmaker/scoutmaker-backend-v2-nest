import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UserFootballRolesSortBy {
  id = 'id',
  name = 'name',
}

export class UserFootballRolesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UserFootballRolesSortBy, {
    message: formatSortingEnumErrorMessage(UserFootballRolesSortBy),
  })
  sortBy?: UserFootballRolesSortBy;
}
