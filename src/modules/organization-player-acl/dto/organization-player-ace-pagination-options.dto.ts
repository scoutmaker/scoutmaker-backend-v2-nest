import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum OrganizationPlayerAceSortBy {
  id = 'id',
  organization = 'organization',
  player = 'player',
  createdAt = 'createdAt',
}

export class OrganizationPlayerAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(OrganizationPlayerAceSortBy, {
    message: formatSortingEnumErrorMessage(OrganizationPlayerAceSortBy),
  })
  sortBy?: OrganizationPlayerAceSortBy;
}
