import { IsString } from 'class-validator';

export class CreateFollowPlayerDto {
  @IsString()
  playerId: string;
}
