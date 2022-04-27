import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum OrdersSortBy {
  id = 'id',
  player = 'player',
  position = 'position',
  status = 'status',
  scout = 'scout',
  description = 'description',
  createdAt = 'createdAt',
}

export class OrdersPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(OrdersSortBy, {
    message: formatSortingEnumErrorMessage(OrdersSortBy),
  })
  sortBy?: OrdersSortBy;
}
