import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum NotesSortBy {
  id = 'id',
  player = 'player',
  positionPlayed = 'positionPlayed',
  percentageRating = 'percentageRating',
  match = 'match',
  author = 'author',
  createdAt = 'createdAt',
}

export type NotesSortByUnion = keyof typeof NotesSortBy;

export class NotesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(NotesSortBy, { message: formatSortingEnumErrorMessage(NotesSortBy) })
  sortBy?: NotesSortBy;
}
