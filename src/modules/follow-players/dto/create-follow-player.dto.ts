import { IsInt } from 'class-validator';

export class CreateFollowPlayerDto {
  @IsInt()
  playerId: number;
}
