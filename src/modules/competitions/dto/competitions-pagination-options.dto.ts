import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum CompetitionsSortBy {
  id = 'id',
  name = 'name',
  level = 'level',
  gender = 'gender',
  country = 'country',
  ageCategory = 'ageCategory',
  type = 'type',
  juniorLevel = 'juniorLevel',
}

export type CompetitionsSortByUnion = keyof typeof CompetitionsSortBy;

export class CompetitionsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(CompetitionsSortBy, {
    message: formatSortingEnumErrorMessage(CompetitionsSortBy),
  })
  sortBy?: CompetitionsSortBy;
}
