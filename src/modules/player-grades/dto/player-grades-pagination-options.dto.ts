import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum PlayerGradesSortBy {
  id = 'id',
  player = 'player',
  competition = 'competition',
  grade = 'grade',
  createdAt = 'createdAt',
}

export class PlayerGradesPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(PlayerGradesSortBy, {
    message: formatSortingEnumErrorMessage(PlayerGradesSortBy),
  })
  sortBy?: PlayerGradesSortBy;
}
