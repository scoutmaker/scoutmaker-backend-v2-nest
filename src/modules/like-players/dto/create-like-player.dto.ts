import { IsInt } from 'class-validator';

export class CreateLikePlayerDto {
  @IsInt()
  playerId: number;
}
