import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FindUniqueCompetitionParticipationDto {
  @IsInt()
  @Type(() => Number)
  teamId: number;

  @IsInt()
  @Type(() => Number)
  competitionId: number;

  @IsInt()
  @Type(() => Number)
  seasonId: number;
}
