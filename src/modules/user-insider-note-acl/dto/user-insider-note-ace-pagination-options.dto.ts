import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UserInsiderNoteAceSortBy {
  id = 'id',
  user = 'user',
  insiderNote = 'insiderNote',
  createdAt = 'createdAt',
}

export class UserInsiderNoteAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UserInsiderNoteAceSortBy, {
    message: formatSortingEnumErrorMessage(UserInsiderNoteAceSortBy),
  })
  sortBy?: UserInsiderNoteAceSortBy;
}
