import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum CompetitionGroupsSortBy {
  id = 'id',
  name = 'name',
  competition = 'competition',
}

export class CompetitionGroupsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(CompetitionGroupsSortBy, {
    message: formatSortingEnumErrorMessage(CompetitionGroupsSortBy),
  })
  sortBy?: CompetitionGroupsSortBy;
}
