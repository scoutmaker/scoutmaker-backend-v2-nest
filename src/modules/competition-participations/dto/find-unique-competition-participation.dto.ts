import { IsInt } from 'class-validator';

export class FindUniqueCompetitionParticipationDto {
  @IsInt()
  teamId: number;

  @IsInt()
  competitionId: number;

  @IsInt()
  seasonId: number;
}
