import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum CompetitionAgeCategoriesSortBy {
  id = 'id',
  name = 'name',
}

export class CompetitionAgeCategoriesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(CompetitionAgeCategoriesSortBy, {
    message: formatSortingEnumErrorMessage(CompetitionAgeCategoriesSortBy),
  })
  sortBy?: CompetitionAgeCategoriesSortBy;
}
