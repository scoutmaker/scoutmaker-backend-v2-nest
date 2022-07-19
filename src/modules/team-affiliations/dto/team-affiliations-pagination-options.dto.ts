import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum TeamAffiliationsSortBy {
  id = 'id',
  teamId = 'teamId',
  playerId = 'playerId',
  startDate = 'startDate',
  endDate = 'endDate',
}

export class TeamAffiliationsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(TeamAffiliationsSortBy, {
    message: formatSortingEnumErrorMessage(TeamAffiliationsSortBy),
  })
  sortBy?: TeamAffiliationsSortBy;
}
