import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class CreateCompetitionParticipationDto {
  @IsCuid()
  teamId: string;

  @IsCuid()
  competitionId: string;

  @IsCuid()
  seasonId: string;

  @IsOptional()
  @IsCuid()
  groupId?: string;
}
