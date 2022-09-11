import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllUserNoteAceDto {
  @IsOptional()
  @IsCuid()
  userId?: string;

  @IsOptional()
  @IsCuid()
  noteId?: string;
}
