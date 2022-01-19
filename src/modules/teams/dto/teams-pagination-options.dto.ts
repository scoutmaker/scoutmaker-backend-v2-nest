import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum TeamsSortBy {
  id = 'id',
  name = 'name',
  clubId = 'clubId',
  countryId = 'countryId',
  regionId = 'regionId',
}

export class TeamsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(TeamsSortBy, {
    message: formatSortingEnumErrorMessage(TeamsSortBy),
  })
  sortBy?: TeamsSortBy;
}
