import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UserPlayerAceSortBy {
  id = 'id',
  user = 'user',
  player = 'player',
  createdAt = 'createdAt',
}

export class UserPlayerAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UserPlayerAceSortBy, {
    message: formatSortingEnumErrorMessage(UserPlayerAceSortBy),
  })
  sortBy?: UserPlayerAceSortBy;
}
