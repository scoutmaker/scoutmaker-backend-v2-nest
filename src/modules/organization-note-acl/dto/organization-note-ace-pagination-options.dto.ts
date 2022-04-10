import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum OrganizationNoteAceSortBy {
  id = 'id',
  organization = 'organization',
  note = 'note',
  createdAt = 'createdAt',
}

export class OrganizationNoteAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(OrganizationNoteAceSortBy, {
    message: formatSortingEnumErrorMessage(OrganizationNoteAceSortBy),
  })
  sortBy?: OrganizationNoteAceSortBy;
}
