import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllInsiderNotesDto {
  @IsOptional()
  @IsCuid()
  playerId?: string;
}
