import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum CompetitionJuniorLevelsSortBy {
  id = 'id',
  name = 'name',
  level = 'level',
}

export class CompetitionJuniorLevelsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(CompetitionJuniorLevelsSortBy, {
    message: formatSortingEnumErrorMessage(CompetitionJuniorLevelsSortBy),
  })
  sortBy?: CompetitionJuniorLevelsSortBy;
}
