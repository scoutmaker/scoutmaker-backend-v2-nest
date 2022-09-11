import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateTeamAffiliationDto {
  @IsString()
  playerId: string;

  @IsString()
  teamId: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: string;
}
