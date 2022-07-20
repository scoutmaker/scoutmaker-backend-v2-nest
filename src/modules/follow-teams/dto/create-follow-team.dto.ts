import { IsInt } from 'class-validator';

export class CreateFollowTeamDto {
  @IsInt()
  teamId: number;
}
