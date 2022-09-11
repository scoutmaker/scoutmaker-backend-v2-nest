import { IsInt, IsOptional } from 'class-validator';

export class FindAllCompetitionParticipationsDto {
  @IsOptional()
  @IsInt()
  seasonId?: string;

  @IsOptional()
  @IsInt()
  teamId?: string;

  @IsOptional()
  @IsInt()
  competitionId?: string;

  @IsOptional()
  @IsInt()
  groupId?: string;
}
