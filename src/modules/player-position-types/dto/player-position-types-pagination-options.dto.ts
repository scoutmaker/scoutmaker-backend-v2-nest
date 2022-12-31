import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum PlayerPositionTypesSortBy {
  id = 'id',
  name = 'name',
  code = 'code',
}

export class PlayerPositionTypesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(PlayerPositionTypesSortBy, {
    message: formatSortingEnumErrorMessage(PlayerPositionTypesSortBy),
  })
  sortBy?: PlayerPositionTypesSortBy;
}
