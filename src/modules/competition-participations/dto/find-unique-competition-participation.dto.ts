import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindUniqueCompetitionParticipationDto {
  @IsCuid()
  teamId: string;

  @IsCuid()
  competitionId: string;

  @IsCuid()
  seasonId: string;
}
