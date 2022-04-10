import { IsEnum, IsOptional } from 'class-validator';

import { PaginationOptionsDto } from '../../../common/pagination/pagination-options.dto';
import { formatSortingEnumErrorMessage } from '../../../utils/helpers';

enum OrganizationReportAceSortBy {
  id = 'id',
  organization = 'organization',
  report = 'report',
  createdAt = 'createdAt',
}

export class OrganizationReportAcePaginationOptionsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(OrganizationReportAceSortBy, {
    message: formatSortingEnumErrorMessage(OrganizationReportAceSortBy),
  })
  sortBy?: OrganizationReportAceSortBy;
}
