import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UsersSortBy {
  id = 'id',
  firstName = 'firstName',
  lastName = 'lastName',
  club = 'club',
  footballRole = 'footballRole',
  region = 'region',
  reportsCount = 'reportsCount',
  notesCount = 'notesCount',
  insiderNotesCount = 'insiderNotesCount',
}

export class UsersPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UsersSortBy, {
    message: formatSortingEnumErrorMessage(UsersSortBy),
  })
  sortBy?: UsersSortBy;
}
