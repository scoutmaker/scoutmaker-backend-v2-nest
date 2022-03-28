import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum UserNoteAceSortBy {
  id = 'id',
  user = 'user',
  note = 'note',
  createdAt = 'createdAt',
}

export class UserNoteAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(UserNoteAceSortBy, {
    message: formatSortingEnumErrorMessage(UserNoteAceSortBy),
  })
  sortBy?: UserNoteAceSortBy;
}
