import { IsInt } from 'class-validator';

export class CreateLikeTeamDto {
  @IsInt()
  teamId: number;
}
