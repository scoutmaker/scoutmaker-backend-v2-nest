import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum PlayerPositionsSortBy {
  id = 'id',
  name = 'name',
  code = 'code',
  listOrder = 'listOrder',
}

export class PlayerPositionsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(PlayerPositionsSortBy, {
    message: formatSortingEnumErrorMessage(PlayerPositionsSortBy),
  })
  sortBy?: PlayerPositionsSortBy;
}
