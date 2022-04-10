import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateTeamAffiliationDto {
  @IsCuid()
  playerId: string;

  @IsCuid()
  teamId: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: string;
}
