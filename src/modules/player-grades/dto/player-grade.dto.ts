import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { PlayerBasicDataDto } from '../../players/dto/player.dto';
import { PlayerGradeLevelEnum } from '../types';

export class PlayerGradeDto {
  @Expose()
  id: string;

  @Expose()
  player: PlayerBasicDataDto;

  @Expose()
  competition: CompetitionBasicDataDto;

  @Expose()
  createdAt: string;

  @Expose()
  grade: PlayerGradeLevelEnum;
}

export class PlayerGradeSuperBasicDto extends OmitType(PlayerGradeDto, [
  'player',
  'competition',
]) {}
