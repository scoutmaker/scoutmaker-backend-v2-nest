import { IsString } from 'class-validator';

export class CreateLikePlayerDto {
  @IsString()
  playerId: string;
}
