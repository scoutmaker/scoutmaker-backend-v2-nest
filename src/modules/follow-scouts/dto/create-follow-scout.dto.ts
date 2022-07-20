import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateFollowScoutDto {
  @IsInt()
  @Type(() => Number)
  scoutId: number;
}
