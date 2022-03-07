import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum InsiderNotesSortBy {
  id = 'id',
  player = 'player',
  createdAt = 'createdAt',
}

export class InsiderNotesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(InsiderNotesSortBy, {
    message: formatSortingEnumErrorMessage(InsiderNotesSortBy),
  })
  sortBy?: InsiderNotesSortBy;
}
