import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllUserInsiderNoteAceDto {
  @IsOptional()
  @IsCuid()
  userId?: string;

  @IsOptional()
  @IsCuid()
  insiderNoteId?: string;
}
