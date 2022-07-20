import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateFollowTeamDto {
  @IsInt()
  @Type(() => Number)
  teamId: number;
}
