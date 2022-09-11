import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePlayerStatsDto } from './create-player-stats.dto';

export class UpdatePlayerStatsDto extends PartialType(
  OmitType(CreatePlayerStatsDto, ['id']),
) {}
