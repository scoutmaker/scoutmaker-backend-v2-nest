import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum CompetitionTypesSortBy {
  id = 'id',
  name = 'name',
}

export class CompetitionTypesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(CompetitionTypesSortBy, {
    message: formatSortingEnumErrorMessage(CompetitionTypesSortBy),
  })
  sortBy?: CompetitionTypesSortBy;
}
