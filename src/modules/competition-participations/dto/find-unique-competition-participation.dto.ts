import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class FindUniqueCompetitionParticipationDto {
  @IsCuid()
  teamId: number;

  @IsCuid()
  competitionId: number;

  @IsCuid()
  seasonId: number;
}
