import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllTeamAffiliationsDto {
  @IsOptional()
  @IsCuid()
  playerId?: string;

  @IsOptional()
  @IsCuid()
  teamId?: string;
}
