import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum PlayerStatsSortBy {
  id = 'id',
  player = 'player',
  match = 'match',
  goals = 'goals',
  assists = 'assists',
  minutesPlayed = 'minutesPlayed',
  yellowCards = 'yellowCards',
  redCards = 'redCards',
}

export class PlayerStatsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(PlayerStatsSortBy, {
    message: formatSortingEnumErrorMessage(PlayerStatsSortBy),
  })
  sortBy?: PlayerStatsSortBy;
}
