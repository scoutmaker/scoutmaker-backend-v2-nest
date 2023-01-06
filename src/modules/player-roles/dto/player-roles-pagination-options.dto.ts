import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum PlayerRolesSortBy {
  id = 'id',
  name = 'name',
  altName = 'altName',
  positionTypeId = 'positionTypeId',
}

export class PlayerRolesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(PlayerRolesSortBy, {
    message: formatSortingEnumErrorMessage(PlayerRolesSortBy),
  })
  sortBy?: PlayerRolesSortBy;
}
