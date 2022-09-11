import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreateCompetitionParticipationDto {
  @IsCuid()
  teamId: number;

  @IsCuid()
  competitionId: number;

  @IsCuid()
  seasonId: number;

  @IsOptional()
  @IsCuid()
  groupId?: string;
}
