import { IsInt } from 'class-validator';

export class CreateFollowScoutDto {
  @IsInt()
  scoutId: number;
}
