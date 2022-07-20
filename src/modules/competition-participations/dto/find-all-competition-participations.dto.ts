import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllCompetitionParticipationsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  seasonId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  teamId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  competitionId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  groupId?: number;
}
