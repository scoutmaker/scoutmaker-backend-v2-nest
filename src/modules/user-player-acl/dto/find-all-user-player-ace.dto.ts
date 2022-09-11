import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllUserPlayerAceDto {
  @IsOptional()
  @IsCuid()
  userId?: string;

  @IsOptional()
  @IsCuid()
  playerId?: string;
}
