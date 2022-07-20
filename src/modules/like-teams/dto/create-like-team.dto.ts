import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateLikeTeamDto {
  @IsInt()
  @Type(() => Number)
  teamId: number;
}
