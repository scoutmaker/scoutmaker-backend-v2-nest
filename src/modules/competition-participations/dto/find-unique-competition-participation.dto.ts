import { IsString } from 'class-validator';

export class FindUniqueCompetitionParticipationDto {
  @IsString()
  teamId: string;

  @IsString()
  competitionId: string;

  @IsString()
  seasonId: string;
}
