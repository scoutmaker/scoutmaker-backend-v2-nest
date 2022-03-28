import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum OrganizationInsiderNoteAceSortBy {
  id = 'id',
  organization = 'organization',
  insiderNote = 'insiderNote',
  createdAt = 'createdAt',
}

export class OrganizationInsiderNoteAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(OrganizationInsiderNoteAceSortBy, {
    message: formatSortingEnumErrorMessage(OrganizationInsiderNoteAceSortBy),
  })
  sortBy?: OrganizationInsiderNoteAceSortBy;
}
