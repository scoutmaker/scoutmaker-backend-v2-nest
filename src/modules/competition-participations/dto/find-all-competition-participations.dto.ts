import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindAllCompetitionParticipationsDto {
  @IsOptional()
  @IsCuid()
  seasonId?: string;

  @IsOptional()
  @IsCuid()
  teamId?: string;

  @IsOptional()
  @IsCuid()
  competitionId?: string;

  @IsOptional()
  @IsCuid()
  groupId?: string;
}
