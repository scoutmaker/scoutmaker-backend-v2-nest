import { IsString } from 'class-validator';

export class CreateFollowTeamDto {
  @IsString()
  teamId: string;
}
