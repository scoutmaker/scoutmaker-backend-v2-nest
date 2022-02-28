import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum PlayersSortBy {
  id = 'id',
  firstName = 'firstName',
  lastName = 'lastName',
  yearOfBirth = 'yearOfBirth',
  height = 'height',
  weight = 'weight',
  footed = 'footed',
  country = 'country',
  primaryPosition = 'primaryPosition',
}

export type PlayersSortByUnion = keyof typeof PlayersSortBy;

export class PlayersPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(PlayersSortBy, {
    message: formatSortingEnumErrorMessage(PlayersSortBy),
  })
  sortBy?: PlayersSortBy;
}
