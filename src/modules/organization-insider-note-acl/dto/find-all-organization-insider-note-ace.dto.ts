import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllOrganizationInsiderNoteAceDto {
  @IsOptional()
  @IsCuid()
  organizationId?: string;

  @IsOptional()
  @IsCuid()
  insiderNoteId?: string;
}
