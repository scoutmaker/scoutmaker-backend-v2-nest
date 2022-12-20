import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum ReportsSortBy {
  id = 'id',
  player = 'player',
  positionPlayed = 'positionPlayed',
  finalRating = 'finalRating',
  percentageRating = 'percentageRating',
  videoUrl = 'videoUrl',
  author = 'author',
  createdAt = 'createdAt',
  status = 'status',
  match = 'match',
}

export class ReportsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ReportsSortBy, {
    message: formatSortingEnumErrorMessage(ReportsSortBy),
  })
  sortBy?: ReportsSortBy;
}
