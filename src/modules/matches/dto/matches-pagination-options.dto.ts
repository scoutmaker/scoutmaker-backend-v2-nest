import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum MatchesSortBy {
  id = 'id',
  date = 'date',
  homeTeam = 'homeTeam',
  awayTeam = 'awayTeam',
  competition = 'competition',
  group = 'group',
  season = 'season',
  reportsCount = 'reportsCount',
  notesCount = 'notesCount',
}

export type MatchesSortByUnion = keyof typeof MatchesSortBy;

export class MatchesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(MatchesSortBy, {
    message: formatSortingEnumErrorMessage(MatchesSortBy),
  })
  sortBy?: MatchesSortBy;
}
