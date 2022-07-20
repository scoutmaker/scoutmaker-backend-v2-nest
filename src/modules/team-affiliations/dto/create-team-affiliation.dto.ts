import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class CreateTeamAffiliationDto {
  @IsInt()
  playerId: number;

  @IsInt()
  teamId: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: string;
}
