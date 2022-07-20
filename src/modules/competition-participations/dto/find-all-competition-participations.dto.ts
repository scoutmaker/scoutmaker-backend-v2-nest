import { IsInt, IsOptional } from 'class-validator';

export class FindAllCompetitionParticipationsDto {
  @IsOptional()
  @IsInt()
  seasonId?: number;

  @IsOptional()
  @IsInt()
  teamId?: number;

  @IsOptional()
  @IsInt()
  competitionId?: number;

  @IsOptional()
  @IsInt()
  groupId?: number;
}
