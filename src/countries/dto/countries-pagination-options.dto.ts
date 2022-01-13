import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from '../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../utils/helpers';

enum CountriesSortBy {
  id = 'id',
  name = 'name',
  code = 'code',
  isEuMember = 'isEuMember',
}

export class CountriesPaginationOptionDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(CountriesSortBy, {
    message: formatSortingEnumErrorMessage(CountriesSortBy),
  })
  sortBy?: CountriesSortBy;
}
