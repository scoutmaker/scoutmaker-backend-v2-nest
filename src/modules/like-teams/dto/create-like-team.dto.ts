import { IsString } from 'class-validator';

export class CreateLikeTeamDto {
  @IsString()
  teamId: string;
}
