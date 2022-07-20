import { IsInt, IsOptional } from 'class-validator';

export class CreateCompetitionParticipationDto {
  @IsInt()
  teamId: number;

  @IsInt()
  competitionId: number;

  @IsInt()
  seasonId: number;

  @IsOptional()
  @IsInt()
  groupId?: number;
}
