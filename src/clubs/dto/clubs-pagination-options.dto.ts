import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from '../../pagination/pagination-options.dto';

enum ClubsSortBy {
  id = 'id',
  name = 'name',
  countryId = 'countryId',
  regionId = 'regionId',
}

export class ClubsPaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(ClubsSortBy, {
    message:
      'Available sorting options are "id", "name", "countryId" or "regionId"',
  })
  sortBy?: ClubsSortBy;
}
