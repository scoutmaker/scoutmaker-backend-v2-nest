import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum PlayerRoleExamplesSortBy {
  id = 'id',
  player = 'player',
  type = 'type',
}

export class PlayerRoleExamplesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(PlayerRoleExamplesSortBy, {
    message: formatSortingEnumErrorMessage(PlayerRoleExamplesSortBy),
  })
  sortBy?: PlayerRoleExamplesSortBy;
}
