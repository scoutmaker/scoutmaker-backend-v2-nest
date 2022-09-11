import { IsOptional, IsString } from 'class-validator';

export class CreateCompetitionParticipationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  teamId: string;

  @IsString()
  competitionId: string;

  @IsString()
  seasonId: string;

  @IsOptional()
  @IsString()
  groupId?: string;
}
