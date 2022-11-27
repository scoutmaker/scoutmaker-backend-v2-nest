import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum CompetitionParticipationsSortBy {
  id = 'id',
  teamId = 'teamId',
  seasonId = 'seasonId',
  competitionId = 'competitionId',
  groupId = 'groupId',
}

export class CompetitionParticipationsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(CompetitionParticipationsSortBy, {
    message: formatSortingEnumErrorMessage(CompetitionParticipationsSortBy),
  })
  sortBy?: CompetitionParticipationsSortBy;
}
