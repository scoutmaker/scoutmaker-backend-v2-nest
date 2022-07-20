import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateFollowPlayerDto {
  @IsInt()
  @Type(() => Number)
  playerId: number;
}
