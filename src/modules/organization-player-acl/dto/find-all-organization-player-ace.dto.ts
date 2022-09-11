import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllOrganizationPlayerAceDto {
  @IsOptional()
  @IsCuid()
  organizationId?: string;

  @IsOptional()
  @IsCuid()
  playerId?: string;
}
