import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllOrganizationNoteAceDto {
  @IsOptional()
  @IsCuid()
  organizationId?: string;

  @IsOptional()
  @IsCuid()
  noteId?: string;
}
