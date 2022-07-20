import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateLikePlayerDto {
  @IsInt()
  @Type(() => Number)
  playerId: number;
}
