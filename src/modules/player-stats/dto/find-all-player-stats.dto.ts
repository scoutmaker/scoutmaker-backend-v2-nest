import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllPlayerStatsDto {
  @IsOptional()
  @IsCuid()
  playerId?: string;

  @IsOptional()
  @IsCuid()
  teamId?: string;

  @IsOptional()
  @IsCuid()
  matchId?: string;
}
