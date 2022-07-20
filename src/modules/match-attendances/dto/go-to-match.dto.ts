import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GoToMatchDto {
  @IsInt()
  @Type(() => Number)
  matchId: number;
}
