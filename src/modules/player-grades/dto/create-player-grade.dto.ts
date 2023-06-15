import { IsEnum, IsString } from 'class-validator';

import { PlayerGradeLevelEnum } from '../types';

export class CreatePlayerGradeDto {
  @IsString()
  competitionId: string;

  @IsString()
  playerId: string;

  @IsEnum(PlayerGradeLevelEnum, {
    message: `PlayerGrade must be a valid enum value. Available values: ${Object.keys(
      PlayerGradeLevelEnum,
    ).join(', ')}`,
  })
  grade: PlayerGradeLevelEnum;
}
