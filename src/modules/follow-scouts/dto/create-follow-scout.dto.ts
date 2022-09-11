import { IsString } from 'class-validator';

export class CreateFollowScoutDto {
  @IsString()
  scoutId: string;
}
