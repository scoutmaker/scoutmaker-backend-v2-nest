import { IsInt } from 'class-validator';

export class GoToMatchDto {
  @IsInt()
  matchId: number;
}
