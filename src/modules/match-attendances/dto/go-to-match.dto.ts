import { IsString } from 'class-validator';

export class GoToMatchDto {
  @IsString()
  matchId: string;
}
