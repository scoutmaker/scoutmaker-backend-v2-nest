import { IsString } from 'class-validator';

export class GoToMatchParamsDto {
  @IsString()
  matchId: string;
}
